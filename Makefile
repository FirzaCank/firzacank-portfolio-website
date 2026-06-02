# Simple Makefile for local development and workflow automation
# Project: Firza Chandra Sandjaya Putra - Personal Portfolio

.PHONY: dev build start lint clean push help

# Default command shows help
help:
	@echo "======================================================================"
	@echo "  Firza Portfolio Website - Available Commands"
	@echo "======================================================================"
	@echo "  make dev          : Run local Next.js development server"
	@echo "  make build        : Verify TypeScript and build the Next.js app locally"
	@echo "  make start        : Run the locally compiled production build"
	@echo "  make lint         : Run ESLint check for style & best practices"
	@echo "  make clean        : Wipe Next.js and npm caches, then reinstall deps"
	@echo "  make push msg=\"\"  : Stage all changes, commit, and push to GitHub"
	@echo "======================================================================"

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

clean:
	@echo "Cleaning up Next.js and npm cache..."
	rm -rf .next node_modules package-lock.json
	@echo "Reinstalling dependencies..."
	npm install
	@echo "Clean and reinstall complete!"

push:
	@if [ -z "$(msg)" ]; then \
		echo "ERROR: Please provide a commit message. Example: make push msg='add new project'"; \
		exit 1; \
	fi
	git add .
	git commit -m "$(msg)"
	git push
