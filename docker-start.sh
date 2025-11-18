#!/bin/bash

# Fintech Ledger Frontend - Docker Quick Start Script

echo "🚀 Fintech Ledger Frontend - Docker Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose not found, using 'docker compose' instead"
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo "📦 Building and starting the application..."
echo ""

# Build and start the container
$COMPOSE_CMD up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Application is running!"
    echo ""
    echo "🌐 Open your browser and go to: http://localhost:8080"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:        $COMPOSE_CMD logs -f"
    echo "   Stop app:         $COMPOSE_CMD down"
    echo "   Restart app:      $COMPOSE_CMD restart"
    echo "   Rebuild app:      $COMPOSE_CMD up --build"
    echo ""
else
    echo ""
    echo "❌ Failed to start the application"
    echo "Check the logs with: $COMPOSE_CMD logs"
    exit 1
fi
