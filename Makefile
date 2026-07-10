# Simple Makefile for local development and workflow automation
# Project: Firza Chandra Sandjaya Putra - Personal Portfolio

.PHONY: dev build start lint clean rag push help

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
	@echo "  make rag          : Rebuild data/portfolio.json + data/embeddings.json"
	@echo "  make push         : Push committed work to GitHub (commit per file first)"
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

rag:
	npm run build-rag

# Deliberately no `git add .` here: files are staged and committed one by one
# so unrelated or private files never slip into a commit.
push:
	@if ! git diff --cached --quiet; then \
		echo "ERROR: You have staged but uncommitted changes. Commit them first."; \
		exit 1; \
	fi
	git push
