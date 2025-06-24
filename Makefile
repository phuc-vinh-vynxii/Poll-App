# Makefile cho Poll App Docker Management

.PHONY: help build run stop clean logs shell push pull deploy-ec2

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build Docker image"
	@echo "  run          - Run container locally"
	@echo "  run-prod     - Run production container"
	@echo "  stop         - Stop container"
	@echo "  clean        - Remove containers and images"
	@echo "  logs         - Show container logs"
	@echo "  shell        - Access container shell"
	@echo "  push         - Push to Docker Hub"
	@echo "  pull         - Pull from Docker Hub"
	@echo "  deploy-ec2   - Deploy to EC2"

# Build Docker image
build:
	docker build -t poll-app:latest .

# Build production image
build-prod:
	docker build -f Dockerfile.prod -t poll-app:prod .

# Run with docker-compose (development)
run:
	docker-compose up -d

# Run production
run-prod:
	docker-compose -f docker-compose.prod.yml up -d

# Stop containers
stop:
	docker-compose down
	docker stop poll-app || true

# Clean up
clean:
	docker-compose down -v
	docker rm -f poll-app || true
	docker rmi poll-app:latest || true
	docker rmi poll-app:prod || true

# Show logs
logs:
	docker-compose logs -f app

# Access container shell
shell:
	docker exec -it poll-app sh

# Push to Docker Hub (update DOCKER_USERNAME first)
push:
	@read -p "Enter your Docker Hub username: " username; \
	docker tag poll-app:latest $$username/poll-app:latest; \
	docker tag poll-app:latest $$username/poll-app:1.0.0; \
	docker push $$username/poll-app:latest; \
	docker push $$username/poll-app:1.0.0

# Pull from Docker Hub
pull:
	@read -p "Enter Docker Hub username: " username; \
	docker pull $$username/poll-app:latest

# Deploy to EC2 (update EC2_IP and KEY_FILE first)
deploy-ec2:
	@echo "Please update EC2_IP and KEY_FILE in scripts/ec2-deploy.sh first"
	@chmod +x scripts/ec2-deploy.sh
	@./scripts/ec2-deploy.sh

# Health check
health:
	curl -f http://localhost:3000/ || echo "Service is not healthy" 