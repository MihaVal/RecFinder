// Shared in-memory user store for demo purposes
// In production, use a proper database like PostgreSQL or MongoDB
const users = new Map();

// Add some demo users
users.set('demo@example.com', {
  id: '1',
  email: 'demo@example.com',
  password: '$2a$10$YKy5.FbQZKfHGzLZGTfJzOXKjDqNBwLGQoVNgW4X2O8nM.UZsG8ly', // password: demo123
  name: 'Demo',
  surname: 'User',
  createdAt: new Date().toISOString()
});

export { users };