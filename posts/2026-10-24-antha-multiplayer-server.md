---
title: How to Run Your Own Antha Multiplayer Server
tags: [backend, dev, guide, nodejs, self-hosting]
---

How to run a very simple p2p multiplayer signal server for the [Antha game engine](https://github.com/electrovir/antha) using [@antha/multiplayer-server](https://www.npmjs.com/package/@antha/multiplayer-server).

<!-- truncate -->

This assumes that you already have a sever setup with at least Node.js (and something like Nginx as well). If you don't already have that, I suggest [this Debian guide](./2025-10-24-T02-debian-setup).

1. Install [ensure-service](https://www.npmjs.com/package/ensure-service):
    ```sh
    npm i -g ensure-service
    ```
2. Install [@antha/multiplayer-server](https://www.npmjs.com/package/@antha/multiplayer-server):
    ```sh
    npm i -g @antha/multiplayer-server
    ```
3. Populate a config file for `@antha/multiplayer-server`. It can be anywhere you want, named whatever you want.
    - example: `~/.config/multiplayer.json`:
        ```json
        {
            "backendOrigin": "https://<your-server-domain>",
            "games": {
                "byId": {
                    "my-game": "https://<game-frontend-domain>"
                }
            },
            "host": "127.0.0.1",
            "lockPort": true,
            "port": 12345
        }
        ```
    - `backendOrigin`: this should be the domain which your server is listening to, like https://my-server.example.com.
    - `games.byId`: this should be an object mapping game ids to their frontend origin.
        - The game ids can be whatever you want, it just needs to be the same id used by your frontend domain to connect to the server.
        - The frontend domain needs to be the frontend where your game is hosted, like https://game.example.com.
    - `port`: this can be whatever port you want, though pick one that's not already in use.
4. Init ensure-service:
    ```sh
    ensure-service init
    ```
    1. Pick whatever service name you want, doesn't really matter.
    2. Enter the same port that you used in your `@antha/multiplayer-server` config.
    3. The start command should be `start-mp-server <path-to-your-antha-multiplayer-config>`, like `start-mp-server ~/.config/multiplayer.json`.
    4. Pick any directory to start it in, doesn't matter.
    5. Keep the default health check.
    6. Do not enable Tailscale.
5. Connect the port number you chose to your Nginx config (see other Nginx guides or [my Debian guide](./2025-10-24-T02-debian-setup) for more details on how to do that).
