# Contact Manager with MongoDB

This project is a simple contact manager that stores data in MongoDB through a Node.js and Express backend.

## Features

- Add a contact
- Edit an existing contact
- Delete a contact
- Load saved contacts from MongoDB

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Update `MONGODB_URI` in `.env` with your MongoDB Atlas connection string.

4. Start the app:

   ```bash
   npm start
   ```

5. Open the app in your browser:

   ```
   http://localhost:3000
   ```

## API

- `GET /api/contacts` - list all contacts
- `POST /api/contacts` - create a contact
- `PUT /api/contacts/:id` - update a contact
- `DELETE /api/contacts/:id` - delete a contact

## Environment Variables

- `PORT` - server port, default `3000`
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - database name, default `contact_manager`