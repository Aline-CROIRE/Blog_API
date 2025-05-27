<div align="center">

# 📝 Blog App API

**A comprehensive, production-ready blog application backend**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) •
[Quick Start](#-quick-start) •
[API Documentation](#-api-documentation) •
[Deployment](#-deployment) •
[Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Performance](#-performance)
- [Monitoring](#-monitoring)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

This is a **full-featured blog application backend** built with modern technologies and best practices. It provides a robust foundation for building blog platforms, content management systems, or any application requiring user authentication, content management, and role-based access control.

### 🎯 What This Project Offers

- **Complete Authentication System** with email verification and password reset
- **Role-Based Authorization** supporting multiple user types (User, Admin)
- **Blog Post Management** with CRUD operations, drafts, and publishing workflow
- **Comment System** with moderation capabilities
- **Admin Dashboard** for user and content management
- **Email Integration** with HTML templates and notifications
- **Production-Ready** with comprehensive error handling and security measures

### 🏗️ Architecture

The application follows a **modular, layered architecture**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │     Models      │
│  (HTTP Layer)   │───▶│ (Business Logic)│───▶│ (Data Access)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Middleware    │    │   Validation    │    │   PostgreSQL    │
│ (Auth, Errors)  │    │   (Input)       │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email verification
- **Secure Login** using JWT tokens (7-day expiration)
- **Password Reset** via secure email tokens
- **Role-Based Access Control** (User/Admin permissions)
- **Email Verification Required** for content creation
- **Session Management** with token refresh capability

### 📝 Content Management
- **Blog Posts** with full CRUD operations
- **Draft/Published/Archived** status workflow
- **Rich Content Support** with HTML content
- **Tag System** for categorization
- **Featured Images** with URL support
- **Search & Pagination** with query filters
- **Author Attribution** and ownership tracking

### 💬 Interactive Features
- **Comment System** on blog posts
- **Comment Moderation** by post authors and admins
- **User Profiles** with editable information
- **Email Notifications** for comments and activities

### 👑 Admin Capabilities
- **User Management** (view, edit roles, delete users)
- **Content Moderation** (approve/reject posts)
- **Dashboard Analytics** (users, posts, comments statistics)
- **System Health Monitoring**
- **Bulk Operations** for content management

### 📧 Email System
- **Responsive HTML Templates** for all emails
- **Welcome Emails** after successful verification
- **Password Reset Emails** with secure tokens
- **Comment Notifications** to post authors
- **Customizable Email Content** and branding

### 🛡️ Security & Quality
- **Input Validation** with comprehensive rules
- **SQL Injection Prevention** using parameterized queries
- **XSS Protection** through input sanitization
- **Rate Limiting Ready** (easily configurable)
- **Error Handling** with detailed logging
- **TypeScript** for type safety and better development experience

---

## 🛠️ Tech Stack

### Core Technologies
- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[TypeScript](https://www.typescriptlang.org/)** (v5.0+) - Type-safe JavaScript
- **[Express.js](https://expressjs.com/)** (v4.18+) - Web application framework
- **[PostgreSQL](https://www.postgresql.org/)** (v12+) - Relational database

### Key Dependencies
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - JWT token management
- **[nodemailer](https://www.npmjs.com/package/nodemailer)** - Email sending
- **[express-validator](https://www.npmjs.com/package/express-validator)** - Input validation
- **[cors](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ts-node](https://www.npmjs.com/package/ts-node)** - TypeScript execution

---

## 📁 Project Structure

```
blog-app-backend/
├── 📁 config/                  # Configuration files
│   ├── database.ts             # PostgreSQL connection setup
│   └── email.ts                # Email service configuration
├── 📁 controllers/             # Request handlers (HTTP layer)
│   ├── authController.ts       # Authentication endpoints
│   ├── postController.ts       # Blog post operations
│   ├── commentController.ts    # Comment management
│   ├── adminController.ts      # Admin operations
│   └── profileController.ts    # User profile management
├── 📁 database/                # Database setup and migrations
│   └── init.ts                 # Schema creation and initialization
├── 📁 middleware/              # Custom middleware functions
│   ├── auth.ts                 # JWT authentication & authorization
│   ├── validation.ts           # Input validation rules
│   └── errorHandler.ts         # Centralized error handling
├── 📁 models/                  # Data access layer
│   ├── User.ts                 # User database operations
│   ├── BlogPost.ts             # Blog post database operations
│   └── Comment.ts              # Comment database operations
├── 📁 routes/                  # API route definitions
│   ├── auth.ts                 # Authentication routes
│   ├── posts.ts                # Blog post routes
│   ├── comments.ts             # Comment routes
│   ├── admin.ts                # Admin routes
│   └── profile.ts              # Profile routes
├── 📁 services/                # Business logic layer
│   ├── authService.ts          # Authentication business logic
│   └── emailService.ts         # Email sending service
├── 📁 types/                   # TypeScript type definitions
│   └── index.ts                # Shared interfaces and types
├── 📁 scripts/                 # Utility scripts
│   └── test-api.js             # Automated API testing
├── 📁 dist/                    # Compiled JavaScript (auto-generated)
├── 📄 server.ts                # Application entry point
├── 📄 package.json             # Dependencies and scripts
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 .env.example             # Environment variables template
├── 📄 .gitignore               # Git ignore rules
├── 📄 postman-collection.json  # Postman API collection
└── 📄 README.md                # This documentation
```

### 📂 Directory Explanations

#### `/config` - Configuration Management
Contains all configuration files for different services:
- **database.ts**: PostgreSQL connection pool setup with error handling
- **email.ts**: Nodemailer transporter configuration for different email providers

#### `/controllers` - HTTP Request Handlers
Handle incoming HTTP requests and coordinate with services:
- Parse request data
- Call appropriate services
- Format and send responses
- Handle HTTP-specific logic

#### `/middleware` - Request Processing Pipeline
Custom middleware for cross-cutting concerns:
- **auth.ts**: JWT token verification and user authentication
- **validation.ts**: Input validation using express-validator
- **errorHandler.ts**: Centralized error handling and logging

#### `/models` - Data Access Layer
Database interaction and query management:
- Raw SQL queries with parameterized statements
- Data transformation and mapping
- Database-specific logic

#### `/services` - Business Logic Layer
Core application logic and external service integration:
- Authentication workflows
- Email sending and template management
- Business rules and validation

#### `/types` - TypeScript Definitions
Shared type definitions for type safety:
- Interface definitions
- Custom types
- API response structures

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **PostgreSQL** (v12.0 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Email Service Account
- **Gmail Account** (recommended) with App Password enabled
- **Or** any SMTP-compatible email service

### Development Tools (Optional but Recommended)
- **Visual Studio Code** with TypeScript extensions
- **Postman** for API testing
- **pgAdmin** or similar PostgreSQL management tool

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/blog-app-backend.git

# Navigate to project directory
cd blog-app-backend

# Check Node.js version (should be 18+)
node --version
