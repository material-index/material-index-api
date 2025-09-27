#!/bin/bash

# Material Index API - Production Deployment Script
# This script deploys the application to production

set -e  # Exit on any error

echo "🚀 Starting Material Index API Production Deployment"
echo "=================================================="

# Configuration
FRONTEND_DIR="demo-app"
BACKEND_DIR="api-gateway"
BUILD_DIR="dist"
PRODUCTION_DIR="/var/www/api.material-index.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    print_error "Frontend or backend directory not found. Please run from project root."
    exit 1
fi

print_status "Building frontend application..."
cd $FRONTEND_DIR

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Build frontend
print_status "Building frontend for production..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Frontend build failed. No dist directory found."
    exit 1
fi

print_status "Frontend build completed successfully!"

# Build backend
print_status "Building backend application..."
cd ../$BACKEND_DIR

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Build backend
print_status "Building backend for production..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Backend build failed. No dist directory found."
    exit 1
fi

print_status "Backend build completed successfully!"

# Create production directory structure
print_status "Creating production directory structure..."
cd ..

# Create production directories
mkdir -p $PRODUCTION_DIR/{frontend,backend,logs}

# Copy frontend files
print_status "Copying frontend files to production..."
cp -r $FRONTEND_DIR/$BUILD_DIR/* $PRODUCTION_DIR/frontend/

# Copy backend files
print_status "Copying backend files to production..."
cp -r $BACKEND_DIR/$BUILD_DIR/* $PRODUCTION_DIR/backend/
cp $BACKEND_DIR/package.json $PRODUCTION_DIR/backend/
cp $BACKEND_DIR/.env.production $PRODUCTION_DIR/backend/.env 2>/dev/null || print_warning "Production .env file not found. Please configure manually."

# Install backend dependencies in production
print_status "Installing backend dependencies in production..."
cd $PRODUCTION_DIR/backend
npm install --production

# Set up PM2
print_status "Setting up PM2 process manager..."
if command -v pm2 &> /dev/null; then
    # Stop existing processes
    pm2 stop material-index-api 2>/dev/null || true
    pm2 delete material-index-api 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
else
    print_warning "PM2 not found. Please install PM2 or start the application manually."
fi

# Set proper permissions
print_status "Setting file permissions..."
chown -R www-data:www-data $PRODUCTION_DIR
chmod -R 755 $PRODUCTION_DIR

# Test the deployment
print_status "Testing deployment..."
cd $PRODUCTION_DIR/backend

# Test if the server starts
if timeout 10s node dist/server.js &> /dev/null; then
    print_status "Backend server test passed!"
else
    print_error "Backend server test failed!"
    exit 1
fi

# Health check
print_status "Performing health check..."
if curl -f http://localhost:3001/health &> /dev/null; then
    print_status "Health check passed!"
else
    print_warning "Health check failed. Please check the server manually."
fi

print_status "Deployment completed successfully!"
echo ""
echo "📁 Production files located at: $PRODUCTION_DIR"
echo "🌐 Frontend: $PRODUCTION_DIR/frontend"
echo "🔧 Backend: $PRODUCTION_DIR/backend"
echo "📊 Logs: $PRODUCTION_DIR/logs"
echo ""
echo "Next steps:"
echo "1. Configure your web server (nginx/apache) to serve the frontend"
echo "2. Set up reverse proxy for the backend API"
echo "3. Configure SSL certificates"
echo "4. Set up monitoring and logging"
echo ""
echo "🚀 Material Index API is ready for production!"