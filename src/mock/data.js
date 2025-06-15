export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'salamjeanlouis8@gmail.com',
    password: 'azertyui',
    role: 'admin'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user'
  }
];

export const mockParkings = [
  {
    id: 1,
    name: 'Parking Central',
    address: '123 Rue Principale',
    totalSpots: 50,
    availableSpots: 30,
    pricePerHour: 5,
    image: 'https://example.com/parking1.jpg',
    description: 'Parking sécurisé au centre-ville'
  },
  {
    id: 2,
    name: 'Parking Express',
    address: '456 Avenue des Fleurs',
    totalSpots: 30,
    availableSpots: 15,
    pricePerHour: 4,
    image: 'https://example.com/parking2.jpg',
    description: 'Parking rapide et pratique'
  }
];

export const mockReservations = [
  {
    id: 1,
    parkingId: 1,
    userId: 2,
    startDate: '2024-03-20T10:00:00',
    endDate: '2024-03-20T12:00:00',
    status: 'pending',
    totalPrice: 10,
    createdAt: '2024-03-19T15:30:00'
  },
  {
    id: 2,
    parkingId: 2,
    userId: 2,
    startDate: '2024-03-21T14:00:00',
    endDate: '2024-03-21T16:00:00',
    status: 'confirmed',
    totalPrice: 8,
    createdAt: '2024-03-19T16:45:00'
  }
];

export const mockClients = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0123456789',
    reservations: 2
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    reservations: 1
  }
];

export const mockDashboardStats = {
  totalClients: 2,
  totalParkings: 2,
  totalReservations: 2,
  totalRevenue: 18,
  pendingReservations: 1,
  confirmedReservations: 1,
  recentReservations: mockReservations.slice(0, 5),
  upcomingReservations: mockReservations.filter(res => new Date(res.startDate) > new Date())
}; 