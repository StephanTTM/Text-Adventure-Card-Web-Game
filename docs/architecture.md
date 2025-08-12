# Architecture Overview

This document outlines the high‑level architecture of the Text Adventure Card Web Game project.  The project is organized as a multi‑package repository with clear separation between authoring tools, client runtime, backend services and shared resources.

## Mission Editor

The mission editor is a React application that allows narrative designers to construct nonlinear story graphs composed of rooms and nodes.  Nodes are connected via outcomes and conditions.  The editor features JSON import/export and live validation to help ensure mission integrity.

## Game Client

The game client is a React application that will run in the player’s browser.  It is responsible for loading mission data from the server, presenting scenes and choices, handling combat and skill checks, and managing the player’s deck of cards and stats.  It communicates with the backend to persist progress and retrieve dynamic content.

## Server

The server exposes RESTful endpoints to serve mission data and, in the future, handle player sessions, save games and multiplayer features.  It is implemented with Express and can be extended to include authentication, database integration or other services.

## Shared Assets

The `assets` directory contains mission JSON files, art assets, audio and other resources used by both the editor and the client.  Keeping these files in a shared location simplifies version control and deployment.