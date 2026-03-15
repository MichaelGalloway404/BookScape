# BookScape

BookScape is a customizable web platform where users can create personalized reading profiles to showcase books they have read. Users can build a visually customized profile page, display their book collection, and add personal quotes or text sections to express their reading interests.

The application allows deep customization of profile layout and styling while integrating external book data from the Open Library API.

The project is deployed using **Vercel** with **PostgreSQL (Vercel Postgres)** as the database.

---

# Live Deployment

Hosted on **Vercel**.

Users can:

- Create accounts
- Build a customizable reading profile
- Search and add books
- Showcase their reading history publicly or privately

---

# Features

## User Accounts

- Secure user registration and login
- Password hashing using **bcrypt**
- Authentication using **JSON Web Tokens (JWT)**

---

## Customizable Profile Pages

Users can extensively customize their profile page including:

- Page background colors and gradients
- Profile container styling
- Border styles and sizes
- Margins and padding
- Layout and appearance

All customization settings are stored in the database as **JSON**.

---

## Book Collection Showcase

Users can:

- Search for books via the **Open Library API**
- Add books to their profile
- Display cover images
- Reorder books
- Remove books from their collection

Each book entry stores:

- Title
- Author
- ISBN
- Cover image ID

---

## Dynamic Text Sections

Users can add unlimited custom text sections such as:

- Quotes
- Reviews
- Reading notes
- Personal thoughts

Each section can be edited directly from the profile page.

---

## Privacy Controls

Profiles can be toggled between:

- **Public**
- **Private**

Public profiles appear on the homepage for discovery.

---

## Public Profile Discovery

The homepage displays a list of all public users. Visitors can browse profiles and view showcased book collections.

---

## Book Search

Users can search for books by:

- Title
- Author
- ISBN

Search results include:

- Book cover
- Title
- Author
- ISBN

Results are paginated for performance.

---

# Tech Stack

## Frontend

- React
- React Router
- Axios
- CSS Modules

## Backend

- Node.js
- Vercel Serverless Functions
- PostgreSQL (Vercel Postgres)

## Authentication & Security

- bcrypt for password hashing
- jsonwebtoken (JWT)

## APIs

- Open Library API
- Open Library Covers API

---

# Database Schema

The application uses PostgreSQL with the following core tables.

---

## users

Stores account information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  private BOOLEAN DEFAULT TRUE,
  book_order_json JSONB DEFAULT '[]'
);
```

---

## user_books

Stores books added to user profiles.

```sql
CREATE TABLE user_books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  isbn TEXT,
  cover_id TEXT,
  title TEXT,
  author TEXT,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_book
    UNIQUE (user_id, isbn)
);
```

---

## user_settings

Stores all customizable profile settings.

```sql
CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY,
  settings JSONB,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

Using **JSONB** allows flexible storage of dynamic UI configuration and user-generated content.

---

# Key Frontend Components

## Home Page

Displays all public users and allows visitors to navigate to individual public profiles.

---

## User Page

The main customizable profile page where users can:

- Edit page styling
- Add quotes or text sections
- Manage books
- Save layout preferences

---

## Book Search Page

Provides an interface to search the **Open Library API** and add books to a user's collection.

---

# Architecture Overview

```
React Frontend
     |
     | REST API
     |
Vercel Serverless Functions
     |
     | SQL Queries
     |
PostgreSQL (Vercel Postgres)
```

External data is retrieved from the **Open Library API** for book search and cover images.

---

# Installation (Local Development)

Clone the repository:

```bash
git clone https://github.com/yourusername/bookscape.git
cd bookscape
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

You will also need to configure environment variables for:

- PostgreSQL connection
- JWT secret

---

# Project Purpose

This project was built to explore:

- Full-stack React application development
- Serverless backend architecture
- PostgreSQL data modeling
- Dynamic UI customization
- Integration with external APIs
