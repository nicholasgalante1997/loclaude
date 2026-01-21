# Open WebUI

- [Open WebUI Home](https://docs.openwebui.com)
- [Open WebUI GitHub](https://github.com/open-webui/open-webui)
- [Open WebUI Getting Started](https://docs.openwebui.com/getting-started/quick-start/)
  - Select [Docker, Docker-Compose]

## Docker Compose Setup

Using Docker Compose simplifies the management of multi-container Docker applications.

If you don't have Docker installed, check out our Docker installation tutorial.

Docker Compose requires an additional package, docker-compose-v2.

Warning: Older Docker Compose tutorials may reference version 1 syntax, which uses commands like docker-compose build. Ensure you use version 2 syntax, which uses commands like docker compose build  

```yml
# Here is an example configuration file for setting up Open WebUI with Docker Compose:

services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
volumes:
  open-webui:
```

Using Slim Images

For environments with limited storage or bandwidth, you can use the slim image variant that excludes pre-bundled models:

```yml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main-slim
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
volumes:
  open-webui:
```

note

Note: Slim images download required models (whisper, embedding models) on first use, which may result in longer initial startup times but significantly smaller image sizes.
Starting the Services

To start your services, run the following command:

`docker compose up -d`

Helper Script

A helper script called `run-compose.sh` is available in the `scripts/` directory. This script assists in choosing which Docker Compose files to include in your deployment, streamlining the setup process. Note that this script is designed for multi-file Docker Compose setups and may require additional compose files (e.g., `docker-compose.gpu.yaml`, `docker-compose.api.yaml`) to function fully.

> Note: For Nvidia GPU support, you change the image from ghcr.io/open-webui/open-webui:main to ghcr.io/open-webui/open-webui:cuda and add the following to your service definition in the docker-compose.yml file:

```yml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

This setup ensures that your application can leverage GPU resources when available.
Next Steps

After installing, visit:

    http://localhost:3000 to access Open WebUI.
    or http://localhost:8080/ when using a Python deployment.

You are now ready to start using Open WebUI!
Using Open WebUI with Ollama
If you're using Open WebUI with Ollama, be sure to check out our Starting with Ollama Guide to learn how to manage your Ollama instances with Open WebUI.