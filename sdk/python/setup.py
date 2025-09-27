from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="material-index-api",
    version="1.0.0",
    author="Material Index Team",
    author_email="info@material-index.com",
    description="Python SDK for Material Index API Gateway",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/material-index/material-index-api",
    project_urls={
        "Bug Reports": "https://github.com/material-index/material-index-api/issues",
        "Source": "https://github.com/material-index/material-index-api",
        "Documentation": "https://docs.material-index.com",
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Information Analysis",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.28.0",
        "pydantic>=1.10.0",
        "httpx>=0.24.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=22.0.0",
            "isort>=5.0.0",
            "mypy>=1.0.0",
        ],
    },
    keywords="material, api, sdk, python, materials, properties",
    include_package_data=True,
    zip_safe=False,
)
