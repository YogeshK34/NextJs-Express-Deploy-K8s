const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const app = express()

// Read environment variables or use defaults
const port = process.env.PORT || 3001
const apiVersion = process.env.API_VERSION || "1.0.0"
const environment = process.env.NODE_ENV || "development"
const dbConnectionString = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/demo"
const apiKey = process.env.API_KEY || "default-api-key"

// Try to read config from mounted ConfigMap
let theme = "default"
let features = {}
try {
  if (fs.existsSync("/app/config/theme.txt")) {
    theme = fs.readFileSync("/app/config/theme.txt", "utf8").trim()
  }

  if (fs.existsSync("/app/config/features.json")) {
    const featuresContent = fs.readFileSync("/app/config/features.json", "utf8")
    features = JSON.parse(featuresContent)
  }
} catch (error) {
  console.error("Error reading config files:", error)
}

// Try to read secrets from mounted Secret
let secretApiKey = apiKey
try {
  if (fs.existsSync("/app/secrets/api-key")) {
    secretApiKey = fs.readFileSync("/app/secrets/api-key", "utf8").trim()
  }
} catch (error) {
  console.error("Error reading secret files:", error)
}

// Enable CORS for all routes
app.use(cors())

const mockDatabase = {
  users: [
    { id: 1, name: "User 1", email: "user1@example.com" },
    { id: 2, name: "User 2", email: "user2@example.com" }
  ],
  products: [
    { id: 1, name: "Product 1", price: 99.99 },
    { id: 2, name: "Product 2", price: 149.99 }
  ]
};

// Simple API endpoint
app.get("/api/users", (req, res) => {
  // Check API key (using the dummy one)
  const providedApiKey = req.headers["x-api-key"];  
  res.json(mockDatabase.users);
});

app.get("/api/products", (req, res) => {
  res.json(mockDatabase.products);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

// Environment variables endpoint
app.get("/api/env", (req, res) => {
  res.json({
    port,
    apiVersion,
    environment,
    theme,
    hasDbConnection: !!dbConnectionString,
    hasApiKey: !!apiKey,
  })
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`)
  console.log(`API Version: ${apiVersion}`)
  console.log(`Environment: ${environment}`)
  console.log(`Theme: ${theme}`)
  console.log(`Features: ${JSON.stringify(features)}`)
  console.log(`Database connection configured: ${!!dbConnectionString}`)
  console.log(`API key configured: ${!!apiKey}`)
})
