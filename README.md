# Intro to Backend Development (Node.js, Express, MongoDB Atlas)

A complete, production-ready implementation of the [freeCodeCamp "Intro to Backend Development" Tutorial](https://www.youtube.com/watch?v=KOutPbKc9UM) taught by Shivani.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Architecture (Model-Route-Controller)](#-architecture-model-route-controller)
3. [Tech Stack](#-tech-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [Step-by-Step Implementation Guide](#-step-by-step-implementation-guide)
   - [Part A: Initialize Node Project & Git](#part-a-initialize-node-project--git)
   - [Part B: Setup MongoDB Atlas Cluster](#part-b-setup-mongodb-atlas-cluster)
   - [Part C: MongoDB Database Models](#part-c-mongodb-database-models)
   - [Part D: Express REST APIs (CRUD Operations)](#part-d-express-rest-apis-crud-operations)
   - [Part E: Testing with Postman Desktop App](#part-e-testing-with-postman-desktop-app)
6. [Running the Application](#-running-the-application)
7. [Submitting Your GitHub Repository](#-submitting-your-github-repository)

---

## 📌 Project Overview
This project demonstrates how to build a scalable and modular backend server using:
- **Node.js** as the JavaScript runtime.
- **Express.js** as the web server framework.
- **MongoDB Atlas** as the cloud NoSQL database with **Mongoose** ODM.
- **Bcrypt** for secure password hashing.
- **Postman** for API verification and testing.

---

## 📐 Architecture (Model-Route-Controller)

The server follows the **Model-Route-Controller (MRC)** pattern for clean separation of concerns:

```
Client (Postman / Browser)
         │
         ▼  HTTP Request (GET, POST, PUT, DELETE)
  [ Express App ] ───> [ Routes (/api/posts, /api/users) ]
                                │
                                ▼
                       [ Controllers ]  <─── Business Logic & Validations
                                │
                                ▼
                         [ Models ]     <─── Mongoose Schemas & Hooks
                                │
                                ▼
                     [ MongoDB Atlas Cloud ]
```

---

## 💻 Tech Stack
- **Runtime:** Node.js (ES Modules `import/export`)
- **Web Framework:** Express.js 4.x
- **Database:** MongoDB Atlas (Cloud)
- **Object Data Modeling (ODM):** Mongoose 8.x
- **Authentication/Security:** bcrypt
- **Environment Management:** dotenv
- **Development Tooling:** nodemon

---

## 📂 Project Directory Structure

```text
intro-to-backend/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js               # MongoDB connection logic
│       ├── models/
│       │   ├── user.model.js       # User schema with bcrypt pre-save hash
│       │   └── post.model.js       # Post schema for CRUD operations
│       ├── controllers/
│       │   ├── user.controller.js   # User registration & login business logic
│       │   └── post.controller.js   # Full CRUD handlers (Create, Read, Update, Delete)
│       ├── routes/
│       │   ├── user.routes.js      # User API routes
│       │   └── post.routes.js      # Post CRUD API routes
│       └── index.js                # Express app entry point
├── .env.example                    # Template for environment variables
├── .env                            # Local environment variables (git-ignored)
├── .gitignore                      # Git ignore file
├── package.json                    # Project configuration & dependencies
├── postman_collection.json         # Pre-configured Postman test collection
└── README.md                       # Comprehensive guide
```

---

## 🛠 Step-by-Step Implementation Guide

### Part A: Initialize Node Project & Git
1. Initialize `package.json` with ES module support:
   ```bash
   npm init -y
   ```
2. In `package.json`, set `"type": "module"`, `"main": "backend/src/index.js"`, and add start scripts:
   ```json
   "scripts": {
     "start": "node backend/src/index.js",
     "dev": "nodemon backend/src/index.js"
   }
   ```
3. Install required packages:
   ```bash
   npm install express mongoose dotenv bcrypt
   npm install -D nodemon
   ```
4. Initialize Git and create `.gitignore` (ignoring `node_modules` and `.env`):
   ```bash
   git init
   ```

---

### Part B: Setup MongoDB Atlas Cluster

Follow these steps to configure your free cloud database:

1. **Sign Up / Log In:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create a Free Cluster:**
   - Click **Create Deployment** (or **Build a Database**).
   - Select the **M0 Shared (Free)** tier.
   - Choose a cloud provider (e.g., AWS) and region nearest to you.
   - Cluster Name: `Cluster0`.
   - Click **Create**.
3. **Configure Database User:**
   - In **Database Access**, create a user (e.g., Username: `admin`, Password: `YourStrongPassword123`).
   - Assign the built-in role: **Read and write to any database**.
4. **Configure Network Access:**
   - In **Network Access**, click **Add IP Address**.
   - Choose **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
5. **Obtain Connection String:**
   - Go to **Database** -> click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy your connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/intro_backend?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
   - Paste this string into your `.env` file as `MONGO_URI`.

---

### Part C: MongoDB Database Models

Located in `backend/src/models/`:

#### 1. `user.model.js`
- **Fields:** `username` (required, unique), `email` (required, unique, regex validated), `password` (required, hashed).
- **Hooks:** Uses Mongoose `pre('save')` hook to automatically salt and hash passwords using `bcrypt`.
- **Methods:** `comparePassword()` helper to verify login passwords securely.

#### 2. `post.model.js`
- **Fields:** `title` (required), `content` (required), `author` (ObjectId referencing `User`), `authorName`, `category`.
- **Options:** `timestamps: true` (automatically creates `createdAt` and `updatedAt`).

---

### Part D: Express REST APIs (CRUD Operations)

#### 1. User & Authentication Endpoints (`/api/users`)
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/users/register` | Register new user (hashes password) | `201 Created` |
| `POST` | `/api/users/login` | Authenticate user & verify password | `200 OK` / `401 Unauthorized` |
| `GET` | `/api/users` | List all users (excluding passwords) | `200 OK` |
| `GET` | `/api/users/:id` | Get user by ID | `200 OK` / `404 Not Found` |

#### 2. Post CRUD Endpoints (`/api/posts`)
| Operation | Method | Endpoint | Description | Status Code |
|---|---|---|---|---|
| **Create** | `POST` | `/api/posts` | Create a new post document | `201 Created` |
| **Read (All)** | `GET` | `/api/posts` | Retrieve all posts (sorted newest first) | `200 OK` |
| **Read (One)** | `GET` | `/api/posts/:id` | Retrieve single post by its ID | `200 OK` / `404 Not Found` |
| **Update** | `PUT` | `/api/posts/:id` | Update title, content, or category | `200 OK` / `404 Not Found` |
| **Delete** | `DELETE` | `/api/posts/:id` | Delete post by ID | `200 OK` / `404 Not Found` |

---

### Part E: Testing with Postman Desktop App

A complete, ready-to-use Postman collection is included in this repository: [`postman_collection.json`](./postman_collection.json).

#### Option 1: 1-Click Import
1. Open the **Postman Desktop App**.
2. Click the **Import** button in the top-left corner.
3. Drag and drop the `postman_collection.json` file into Postman.
4. All routes, pre-filled JSON bodies, and headers are imported automatically!

#### Option 2: Manual Testing Steps

1. **Check Server Health:**
   - Method: `GET`
   - URL: `http://localhost:5000/`
   - Expected Output: `200 OK` with welcome message and API index.

2. **Register a User:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/users/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "john_doe",
       "email": "john@example.com",
       "password": "Password123!"
     }
     ```
   - Expected Output: `201 Created` with created user details (password omitted).

3. **Login User:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/users/login`
   - Body:
     ```json
     {
       "email": "john@example.com",
       "password": "Password123!"
     }
     ```
   - Expected Output: `200 OK` with user profile.

4. **Create a Post (CRUD - Create):**
   - Method: `POST`
   - URL: `http://localhost:5000/api/posts`
   - Body:
     ```json
     {
       "title": "Getting Started with Node & Express",
       "content": "Building scalable REST APIs with MongoDB Atlas and Mongoose.",
       "authorName": "John Doe",
       "category": "Backend"
     }
     ```
   - Expected Output: `201 Created` with post `_id`.

5. **Read All Posts (CRUD - Read):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/posts`
   - Expected Output: `200 OK` array containing the post.

6. **Read Single Post (CRUD - Read One):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/posts/<COPIED_POST_ID>`
   - Expected Output: `200 OK` with post document.

7. **Update Post (CRUD - Update):**
   - Method: `PUT`
   - URL: `http://localhost:5000/api/posts/<COPIED_POST_ID>`
   - Body:
     ```json
     {
       "title": "Mastering Node & Express (Updated)",
       "category": "Advanced Backend"
     }
     ```
   - Expected Output: `200 OK` with updated post.

8. **Delete Post (CRUD - Delete):**
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/posts/<COPIED_POST_ID>`
   - Expected Output: `200 OK` confirming deletion.

---

## 🚀 Running the Application

1. **Clone repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd intro-to-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the project root:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/intro_backend?retryWrites=true&w=majority
     ```

4. **Start the server:**
   - Development mode (with auto-restart via nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

5. Server will run at: `http://localhost:5000`

---

## 📤 Submitting Your GitHub Repository

1. Create a new public repository on [GitHub](https://github.com/new):
   - Repository name: `intro-to-backend`
   - Set visibility to: **Public**
   - Leave "Initialize with README" **unchecked** (we already have one).
2. Connect your local git repository to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/intro-to-backend.git
   git branch -M main
   git push -u origin main
   ```
3. Copy your repository URL (`https://github.com/<YOUR-USERNAME>/intro-to-backend`) and submit it for your assignment!
