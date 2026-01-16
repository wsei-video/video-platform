# WatchMe - video streaming platform

## Overview

WatchMe is a video streaming platform that allows users to upload, watch, and share videos.

## Project Structure

This project is organized as a monorepo:

*   **[video-server](./video-server/README.md)**: The backend API built with NestJS.
*   **[video-web-client](./video-web-client/README.md)**: The frontend application built with Vue 3.

## Links

- [Figma design](https://www.figma.com/design/md6kWHFo1SVd4riYbAfm9F/WatchMe?node-id=0-1&t=gtNyaivzuqgGjz5E-1)
- [Project specification](https://wseii-my.sharepoint.com/:w:/g/personal/tomasz_smialek_microsoft_wsei_edu_pl/EQupTw3bdkBFnxATHrF-sjQBbfxFqO0aOQu8Dbe-WXE6gg?e=UBAaV1)

## Quick Start

1.  **Setup Backend:**
    Navigate to `video-server` and follow the instructions in its README to set up the database and start the API.
    ```bash
    cd video-server
    npm install
    npm run start:dev
    ```

2.  **Setup Frontend:**
    Navigate to `video-web-client` and follow the instructions in its README to start the development server.
    ```bash
    cd video-web-client
    npm install
    npm run dev
    ```