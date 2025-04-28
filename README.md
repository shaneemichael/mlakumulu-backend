# Mlaku-Mulu Travel Agency Backend

This is a backend application for the Mlaku-Mulu Travel Agency, built with NestJS and TypeScript. It provides API endpoints for managing tourists and their travel records.

## Features

- Authentication for employees and tourists
- Tourist management (CRUD operations)
- Travel management (CRUD operations)
- Role-based access control
- API documentation with Swagger

## Tech Stack

- Framework: NestJS
- Language: TypeScript
- TypeORM
- Database: SQLite (for simplicity, can be changed to other databases)
- Authentication: JWT 
- API Documentation: Swagger

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mlaku-mulu-backend

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
JWT_SECRET=your_jwt_secret_key
DATABASE_FILE=travel-agency.sqlite
```

## Running the app

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /auth/login` - Login for employees and tourists
- `POST /auth/register/tourist` - Register a new tourist
- `POST /auth/register/employee` - Register a new employee

### Tourists

- `GET /tourists` - Get all tourists (employee only)
- `GET /tourists/profile` - Get logged in tourist profile
- `GET /tourists/:id` - Get a specific tourist by ID
- `POST /tourists` - Create a new tourist (employee only)
- `PATCH /tourists/:id` - Update a tourist
- `DELETE /tourists/:id` - Delete a tourist (employee only)

### Travels

- `GET /travels` - Get all travels (employee only)
- `GET /travels/my-travels` - Get travels for logged in tourist
- `GET /travels/:id` - Get a specific travel by ID
- `POST /travels` - Create a new travel (employee only)
- `PATCH /travels/:id` - Update a travel (employee only)
- `DELETE /travels/:id` - Delete a travel (employee only)

## User Roles

The application has two user roles:

1. **Employee** - Can manage tourists and their travels
2. **Tourist** - Can view their own profile and travel history

## Database Schema

The application uses the following entity relationships:

1. **User** - Base entity for authentication
2. **Tourist** -  Extends User, contains tourist-specific information
3. **Travel** - Contains travel information linked to tourists

### User Entity
- id: UUID
- username: string (unique)
- password: string (hashed)
- role: enum (employee, tourist)
- createdAt: Date
- updatedAt: Date

### Tourist Entity
- id: UUID
- name: string
- nationality: string
- passportNumber: string (optional)
- phoneNumber: string (optional)
- email: string (optional)
- userId: UUID (foreign key to User)
- createdAt: Date
- updatedAt: Date

### Travel Entity
- id: UUID
- startDate: Date (UTC)
- endDate: Date (UTC)
- destination: JSON
- touristId: UUID (foreign key to Tourist)
- createdAt: Date
- updatedAt: Date

## Development
To contribute to this project:
1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request