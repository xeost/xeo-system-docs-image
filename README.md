# xeo-system-docs-image

A Docker image for generating internal system documentation, designed for the AI-assisted development era.

## Overview

This repository is intended to be the **Source of Truth** for the development of content in other repositories. It stores the system design in Markdown (with Mermaid support) and the OpenAPI API description.

In a modern workflow where programming is heavily assisted by AI, having a clear, centralized, and machine-readable documentation source is critical. Other repositories and AI agents can access this content using a **GitHub MCP Server** from code editors like Cursor or Windsurf.

## Features

- **Starlight Documentation Site**: Beautiful, searchable documentation site for your Markdown content.
- **Mermaid Support**: Native rendering of Mermaid diagrams for architecture visualization.
- **API Visualization**:
  - **Swagger UI**: Interactive API documentation.
  - **Redoc**: Clean, responsive API reference documentation.
  - **Raw Spec Server**: Serves the raw OpenAPI YAML/JSON for tool consumption.

## Usage

### Directory Structure

To use this image, organize your content as follows:

```
.
├── docs/               # Your Starlight markdown content
│   └── system-design/  # System design documents
├── openapi/            # Your OpenAPI specifications
│   └── api-spec.yml
├── astro.config.mjs    # Starlight configuration
└── docker-compose.yml
```

### Docker Compose

You can easily spin up the entire documentation suite using Docker Compose.

```yaml
services:
  docs:
    image: xeost/xeo-system-docs-image:latest
    ports:
      - "12000:4321" # Starlight
      - "12001:8081" # Spec Server
      - "12002:8082" # Swagger UI
      - "12003:8083" # Redoc
    volumes:
      - ./docs:/app/starlight/src/content/docs
      - ./openapi:/app/api-design
      - ./astro.config.mjs:/app/starlight/astro.config.mjs
```

Run the stack:

```bash
docker-compose up
```

### Accessing the Services

Once running, the services are available at the following ports:

| Service | URL | Description |
|---------|-----|-------------|
| **Documentation** | `http://localhost:12000` | Starlight documentation site with system designs |
| **Raw Spec** | `http://localhost:12001` | Raw OpenAPI file server |
| **Swagger UI** | `http://localhost:12002` | Interactive API playground |
| **Redoc** | `http://localhost:12003` | API Reference documentation |

## Workflow

1. **Edit**: Use your AI-powered code editor to modify Markdown files or OpenAPI specs.
2. **Visualize**: Run `docker-compose up` to preview changes instantly in the browser.
3. **Collaborate**: Push changes to GitHub. This allows for collaborative synchronization.
4. **Validate**: Use CI tools to validate Markdown and OpenAPI specs (e.g., using Spectral) on push.
5. **Consume**: Connect your AI editor to this repository via GitHub MCP to read the latest specs and designs while working on implementation in other repositories.
