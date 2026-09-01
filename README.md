# TroxCard

Welcome to your TanStack Start application!

## Getting Started

To run this application locally:

```bash
npm install
npm run dev
```

## Docker Containerization

To run using Docker Compose (App + MongoDB):

```bash
docker compose up --build -d
```

To run using Single Container (`Dockerfile.all-in-one`):

```bash
docker build -f Dockerfile.all-in-one -t troxcard-all-in-one .
docker run -d -p 3000:3000 -p 27017:27017 --env-file .env --name troxcard-app troxcard-all-in-one
```

## Building For Production

To build the project manually:

```bash
npm run build
npm start
```
