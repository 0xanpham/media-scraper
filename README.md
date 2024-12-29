# Media Scraper

## Overview

## Installation

### 1. Install docker and docker-compose

### 2. Clone this repository

### 3. Run the app

Inside the root folder, run this command

```bash
docker compose up
```

## Step by step tutorial

### Get authenticated token

#### Sign up

```bash
curl
--location 'http://localhost:8080/auth/sign-up' \
--header 'Content-Type: application/json' \
--data '{
    "username": "username",
    "password": "123456"
}'
```

#### Sign in

```bash
curl
--location 'http://localhost:8080/auth/sign-in' \
--header 'Content-Type: application/json' \
--data '{
    "username": "username",
    "password": "123456"
}'
```

### Select website urls to scrape from

```bash
curl
--location 'http://localhost:8080/media/import' \
--header 'Authorization: Bearer {TOKEN}' \
--header 'Content-Type: application/json' \
--data '{
    "urls": [
        "https://www.stadiumcreativegroup.com/",
        "https://www.pastamancini.com/en",
        "https://an-pham.com/",
        "https://www.flashscore.com/"
    ]
}'
```

### Get medias

#### via API

```bash
curl --location 'http://localhost:8080/media?page=1&limit=12&type=image&search=name'
```

#### via webpage

Visit http://localhost:3000

## Demo
