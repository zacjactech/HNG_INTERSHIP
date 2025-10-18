# Dynamic Profile API

A Node.js/Express.js API that returns user profile information and a random cat fact fetched from an external API, with Swagger UI documentation.

## Features

- **Dynamic User Profiles**: Update user details via POST endpoint
- **GET /me**: Returns user profile information and a random cat fact
- **POST /user**: Update user details (email, name, stack)
- **Swagger UI**: Interactive API documentation available at `/api-docs`
- **Health Check**: Endpoint to verify API status at `/health`
- **Error Handling**: Proper error handling for external API failures
- **Dynamic Content**: Timestamp updates on each request, new cat fact on every call

## Response Format

```json
{
  "status": "success",
  "user": {
    "email": "your_email@example.com",  // From DEFAULT_EMAIL env var
    "name": "Your Full Name",           // From DEFAULT_NAME env var
    "stack": "Node.js/Express"        // From DEFAULT_STACK env var
  },
  "timestamp": "2025-10-18T10:40:35.453Z",
  "fact": "In multi-cat households, cats of the opposite sex usually get along better."
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16.0.0 or higher)
- pnpm package manager

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000

# Default User Details
DEFAULT_EMAIL=your_email@example.com
DEFAULT_NAME=Your Full Name
DEFAULT_STACK=Node.js/Express

# API Configuration
CAT_FACT_API_URL=https://catfact.ninja/fact

# Environment
NODE_ENV=development
```

You can copy the `.env.example` file and modify the values:
```bash
cp .env.example .env
```

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create and configure your `.env` file (see Environment Variables section above)

4. Start the server:
   ```bash
   pnpm start
   ```

5. The server will start on port 3000 (or the port specified in the PORT environment variable)

## API Endpoints

- `GET /` - API information and available endpoints
- `GET /me` - Get user profile and random cat fact
- `POST /user` - Update user details (email, name, stack)
- `GET /health` - Health check endpoint
- `GET /api-docs` - Swagger UI documentation

## Usage Examples

### Update User Details
```bash
# Update user information
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "stack": "Node.js/React"
  }'
```

### Get User Profile with Cat Fact
```bash
# Get current user profile and random cat fact
curl http://localhost:3000/me
```

## Error Handling

- **Cat Fact API Failure**: Returns 500 status code with message "Could not fetch cat fact right now."
- **Invalid User Data**: POST requests with missing fields or invalid email format return 400 status code
- **Validation Errors**: All user input is validated with descriptive error messages

## Deployment

This API is ready for deployment on Railway. The project includes proper configuration for production deployment.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API requests
- **Swagger-jsdoc** - OpenAPI specification generator
- **Swagger-ui-express** - Interactive API documentation

## Notes

- User details are stored in-memory (reset when server restarts)
- In production, consider using a database for persistent storage
- Default user details are provided by environment variables if no POST request is made
- Environment variables allow for easy configuration without code changes
- The `.env` file should never be committed to version control (already in .gitignore)