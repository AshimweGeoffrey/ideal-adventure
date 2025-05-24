// MongoDB Initialization Script for Portfolio 26466
// This script runs when the MongoDB container starts for the first time

// Switch to the portfolio database
db = db.getSiblingDB("portfolio_26466");

// Create collections
db.createCollection("users");
db.createCollection("portfolios");
db.createCollection("apikeys");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.portfolios.createIndex({ userId: 1 });
db.portfolios.createIndex({ createdAt: -1 });
db.apikeys.createIndex({ key: 1 }, { unique: true });
db.apikeys.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create default admin user
db.users.insertOne({
  _id: ObjectId(),
  username: "admin26466",
  email: "admin26466@portfolio.local",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: secret
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Create API key for admin access
db.apikeys.insertOne({
  _id: ObjectId(),
  key: "portfolio26466apikey2025",
  name: "Admin API Key",
  userId: null, // System-wide key
  permissions: ["read", "write", "admin"],
  isActive: true,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
});

// Create sample portfolio item
db.portfolios.insertOne({
  _id: ObjectId(),
  title: "Sample Portfolio Project",
  description: "This is a sample portfolio project for Student ID 26466",
  technologies: ["Node.js", "React", "MongoDB", "Docker", "Traefik"],
  imageUrl: "/images/sample-project.jpg",
  githubUrl: "https://github.com/student26466/portfolio-project",
  liveUrl: "https://portfolio-26466.local",
  featured: true,
  status: "completed",
  userId: null, // Public project
  createdAt: new Date(),
  updatedAt: new Date(),
});

print("Database initialized successfully for Portfolio 26466!");
