// Shared stores for all API endpoints
// In production, use a proper database

// Users store
export const users = new Map();

// Events store  
export const events = new Map();

// Event participants store
export const eventParticipants = new Map();

// Initialize with demo data
users.set('demo@example.com', {
  id: '1',
  email: 'demo@example.com',
  password: '$2a$10$SjEpgyLwNak7cRgNArjHQOOqBZaJ/cbcD3QBgj0WGqzDK09JadMSS', // password: demo123
  name: 'Demo',
  surname: 'User',
  createdAt: new Date().toISOString()
});

// Demo events
const demoEvents = [
  {
    id: '1',
    title: 'Jutranji tek v Tivoliju',
    description: 'Skupinski tek po Tivoliju za vse nivoje',
    sport: 'Tek',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '07:00',
    location: 'Tivoli, Ljubljana',
    maxParticipants: 20,
    currentParticipants: 5,
    creatorId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Nogomet na Kodeljevem',
    description: 'Rekreacijski nogomet, pridružite se!',
    sport: 'Nogomet',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '18:00',
    location: 'ŠP Kodeljevo, Ljubljana',
    maxParticipants: 14,
    currentParticipants: 8,
    creatorId: '1',
    createdAt: new Date().toISOString()
  }
];

demoEvents.forEach(event => events.set(event.id, event));