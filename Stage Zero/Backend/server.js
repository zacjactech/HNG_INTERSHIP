const express = require('express');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for user details (in production, use a database)
let userDetails = {
  email: 'your_email@example.com',
  name: 'Your Full Name',
  stack: 'Node.js/Express'
};

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Profile API',
      version: '1.0.0',
      description: 'API that returns user profile details and a dynamic cat fact.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Update user details
 *     description: Updates the user details that will be returned by the /me endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               stack:
 *                 type: string
 *                 description: User's technology stack
 *                 example: Node.js/Express
 *             required:
 *               - email
 *               - name
 *               - stack
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User details updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stack:
 *                       type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 */

// POST endpoint to update user details
app.post('/user', (req, res) => {
  try {
       
    const { email, name, stack } = req.body;

    // Validate required fields
    if (!email || !name || !stack) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${!email ? 'email ' : ''}${!name ? 'name ' : ''}${!stack ? 'stack' : ''}`.trim(),
        timestamp: new Date().toISOString()
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format',
        timestamp: new Date().toISOString()
      });
    }

    // Update user details
    userDetails = {
      email: email.trim(),
      name: name.trim(),
      stack: stack.trim()
    };

    res.status(200).json({
      status: 'success',
      message: 'User details updated successfully',
      user: userDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating user details:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user profile and random cat fact
 *     description: Returns user profile information and a random cat fact fetched from an external API
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     stack:
 *                       type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 fact:
 *                   type: string
 *       500:
 *         description: Error fetching cat fact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 fact:
 *                   type: string
 */

// User profile endpoint
app.get('/me', async (req, res) => {
  try {
    // Fetch random cat fact from external API
    let catFact = 'Could not fetch cat fact right now.';
    
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      if (response.data && response.data.fact) {
        catFact = response.data.fact;
      }
    } catch (error) {
      console.error('Error fetching cat fact:', error.message);
      // Return error response with fallback message
      return res.status(500).json({
        status: 'error',
        message: 'Could not fetch cat fact from external API',
        timestamp: new Date().toISOString(),
        fact: catFact
      });
    }

    // Return successful response with dynamic user details
    res.status(200).json({
      status: 'success',
      user: userDetails, // Using dynamic user details instead of hardcoded values
      timestamp: new Date().toISOString(),
      fact: catFact
    });

  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      fact: 'Could not fetch cat fact right now.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Dynamic Profile API is running',
    endpoints: {
      'POST /user': 'POST - Update user details',
      'GET /me': 'GET - Get user profile and random cat fact',
      '/api-docs': 'GET - Swagger UI documentation',
      '/health': 'GET - Health check'
    },
    currentUser: userDetails,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  
  // Handle JSON parsing errors specifically
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON format in request body',
      details: 'Please ensure your JSON is properly formatted',
      timestamp: new Date().toISOString()
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  console.log(`API endpoints:`);
  console.log(`  - http://localhost:${PORT}/me`);
  console.log(`  - http://localhost:${PORT}/health`);
});

module.exports = app;