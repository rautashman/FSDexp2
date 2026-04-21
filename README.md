# Contact Manager with MongoDB

This repository contains two JavaScript programs:

1. A full-stack Contact Manager web app (Express + MongoDB + vanilla HTML/CSS/JS)
2. A standalone CLI script for filtering sample product data by minimum price

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Contact Manager Application](#contact-manager-application)
- [REST API Reference](#rest-api-reference)
- [Validation Rules and Error Handling](#validation-rules-and-error-handling)
- [Product Filter CLI Script](#product-filter-cli-script)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Project Overview

The Contact Manager lets users:

- Create contacts
- View saved contacts
- Edit existing contacts
- Delete contacts

Contacts are persisted in MongoDB and served through an Express backend. The frontend is a single static page served by the same Node.js server.

The repository also includes a separate script (`productListReader.js`) that runs in the terminal and demonstrates filtering an in-memory product list by user-provided minimum price.

## Tech Stack

- Runtime: Node.js
- Backend: Express
- Database: MongoDB (native Node driver)
- Frontend: HTML, CSS, vanilla JavaScript
- Config: dotenv

## Repository Structure

- `server.js`: Express server, MongoDB connection, REST API routes, static hosting
- `index.html`: Frontend markup and styles for the contact manager UI
- `index.js`: Frontend logic (form handling, validation, CRUD requests, rendering)
- `productListReader.js`: Standalone CLI product filter demo
- `.env.example`: Environment variable template
- `.env`: Local environment values (not for sharing)
- `package.json`: Dependencies and npm scripts

## Contact Manager Application

### Prerequisites

- Node.js 18+
- Access to MongoDB:
   - Local: `mongodb://127.0.0.1:27017`
   - Or MongoDB Atlas connection string

### Installation

```bash
npm install
```

### Environment Setup

Create your local environment file:

```bash
cp .env.example .env
```

Configure these variables in `.env`:

- `PORT`: Server port (default: `3000`)
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://127.0.0.1:27017`)
- `MONGODB_DB`: Database name (default: `contact_manager`)

### Run

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## REST API Reference

Base URL: `http://localhost:3000`

### Data Shape

Contact response objects are returned in this format:

```json
{
   "id": "68053d1dcf2e3370d4f56789",
   "name": "Jane Doe",
   "email": "jane@example.com",
   "phone": "9876543210"
}
```

### GET /api/contacts

Returns all contacts sorted by newest first.

- Success: `200 OK`
- Body: `Contact[]`

### POST /api/contacts

Creates a new contact.

- Request body:

```json
{
   "name": "Jane Doe",
   "email": "jane@example.com",
   "phone": "9876543210"
}
```

- Success: `201 Created`
- Body: created `Contact`
- Validation failure: `400 Bad Request`
- Server failure: `500 Internal Server Error`

### PUT /api/contacts/:id

Updates an existing contact.

- Path param: `id` (MongoDB ObjectId string)
- Request body: same as POST
- Success: `200 OK`
- Body: updated `Contact`
- Invalid id: `400 Bad Request`
- Contact not found: `404 Not Found`
- Validation failure: `400 Bad Request`
- Server failure: `500 Internal Server Error`

### DELETE /api/contacts/:id

Deletes a contact.

- Path param: `id` (MongoDB ObjectId string)
- Success: `204 No Content`
- Invalid id: `400 Bad Request`
- Contact not found: `404 Not Found`
- Server failure: `500 Internal Server Error`

## Validation Rules and Error Handling

Server-side validation rules:

- `name` is required and trimmed
- `email` is required, trimmed, and must match a basic email format
- `phone` is required and trimmed

Error response format for validation failures:

```json
{
   "message": "Name is required.",
   "errors": ["Name is required."]
}
```

The frontend also applies client-side validation before sending requests.

## Product Filter CLI Script

`productListReader.js` is independent of the web app.

### Run

```bash
node productListReader.js
```

What it does:

- Prints a tabular list of sample products
- Prompts for a minimum price
- Prints products with `price >= minPrice`

## Development Notes

- `npm start` and `npm run dev` both run `node server.js`
- Static assets are served from the project root
- The application stores extra DB fields (`createdAt`, `updatedAt`) internally, but only exposes `id`, `name`, `email`, and `phone` in API responses

## Troubleshooting

### Server fails on startup

- Ensure MongoDB is reachable from `MONGODB_URI`
- Verify the `.env` file exists and has valid values

### Contacts do not load in browser

- Confirm the server is running on the configured `PORT`
- Open browser devtools and check failed requests to `/api/contacts`

### Invalid contact id errors

- Ensure `:id` path values are valid MongoDB ObjectId strings