💬 WhatsApp Clone
Group Project
Sequence of operations
Install Requirements
Create .env file with MongoDB URI
Run seed.js to populate sample data
Run index.js to start server
Access application at http://localhost:8080/chats
Deploy to Vercel with MongoDB Atlas URI
Installing Requirements:
npm install
models
Contains Mongoose schema definitions.
chat.js - Defines chat document structure with from/to/msg fields and timestamps.
views
Contains EJS templates for rendering pages.
front.ejs - Displays list of chats with timestamps
edit.ejs - Form for editing existing chat messages
new.ejs - Form for creating new chat messages
public
Contains static CSS files for styling.
style.css - Main application styling with card-based layout
style1.css - Form-specific styling for new/edit pages
index.js
Main application entry point. Sets up Express server, routes, and MongoDB connection.
Command Line Arguments: None (uses environment variables for configuration)
seed.js
Populates database with sample chat data for testing.
Command Line Arguments:
--fresh: Clears existing data before seeding (optional)
.env.example
Template for environment configuration file.
Required variable:
MONGO_URI: MongoDB connection string (local or Atlas)
vercel.json
Vercel deployment configuration for serverless function deployment.
package.json
Project metadata and dependencies.
Required packages: express, ejs, mongoose, method-override
Deployment Notes:
For local development: Use MongoDB local URI in .env
For Vercel deployment: Add MONGO_URI environment variable with Atlas connection string
Password special characters must be URL-encoded (@ → %40)
MongoDB Atlas requires IP whitelist: Allow Access from Anywhere (0.0.0.0/0)
