const Bus = require('../models/Bus');
const Trip = require('../models/Trip');

class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedClients = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, {
        socket,
        subscriptions: new Set()
      });

      // Handle client subscriptions
      socket.on('subscribe', (data) => {
        this.handleSubscription(socket, data);
      });

      // Handle client unsubscriptions
      socket.on('unsubscribe', (data) => {
        this.handleUnsubscription(socket, data);
      });

      // Handle location updates from buses
      socket.on('busLocationUpdate', (data) => {
        this.handleBusLocationUpdate(socket, data);
      });

      // Handle trip updates
      socket.on('tripUpdate', (data) => {
        this.handleTripUpdate(socket, data);
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      // Send initial data to client
      this.sendInitialData(socket);
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  handleSubscription(socket, data) {
    const client = this.connectedClients.get(socket.id);
    if (!client) return;

    const { type, id } = data;
    
    switch (type) {
      case 'bus':
        client.subscriptions.add(`bus:${id}`);
        socket.join(`bus:${id}`);
        break;
      case 'trip':
        client.subscriptions.add(`trip:${id}`);
        socket.join(`trip:${id}`);
        break;
      case 'route':
        client.subscriptions.add(`route:${id}`);
        socket.join(`route:${id}`);
        break;
      case 'all_buses':
        client.subscriptions.add('all_buses');
        socket.join('all_buses');
        break;
      case 'all_trips':
        client.subscriptions.add('all_trips');
        socket.join('all_trips');
        break;
    }

    console.log(`Client ${socket.id} subscribed to ${type}:${id}`);
  }

  handleUnsubscription(socket, data) {
    const client = this.connectedClients.get(socket.id);
    if (!client) return;

    const { type, id } = data;
    
    switch (type) {
      case 'bus':
        client.subscriptions.delete(`bus:${id}`);
        socket.leave(`bus:${id}`);
        break;
      case 'trip':
        client.subscriptions.delete(`trip:${id}`);
        socket.leave(`trip:${id}`);
        break;
      case 'route':
        client.subscriptions.delete(`route:${id}`);
        socket.leave(`route:${id}`);
        break;
      case 'all_buses':
        client.subscriptions.delete('all_buses');
        socket.leave('all_buses');
        break;
      case 'all_trips':
        client.subscriptions.delete('all_trips');
        socket.leave('all_trips');
        break;
    }

    console.log(`Client ${socket.id} unsubscribed from ${type}:${id}`);
  }

  handleBusLocationUpdate(socket, data) {
    // Broadcast to all clients subscribed to this bus
    this.io.to(`bus:${data.busId}`).emit('busLocationUpdate', data);
    
    // Broadcast to all clients subscribed to all buses
    this.io.to('all_buses').emit('busLocationUpdate', data);
  }

  handleTripUpdate(socket, data) {
    // Broadcast to all clients subscribed to this trip
    this.io.to(`trip:${data.tripId}`).emit('tripUpdate', data);
    
    // Broadcast to all clients subscribed to all trips
    this.io.to('all_trips').emit('tripUpdate', data);
  }

  async sendInitialData(socket) {
    try {
      // Send active buses
      const activeBuses = await Bus.find({ 'currentStatus.status': 'active' })
        .select('busId currentStatus.location currentStatus.speed currentStatus.direction');
      
      socket.emit('initialData', {
        type: 'buses',
        data: activeBuses
      });

      // Send active trips
      const activeTrips = await Trip.find({ 
        status: { $in: ['boarding', 'departed', 'in_transit'] } 
      }).select('tripId busId status progress');

      socket.emit('initialData', {
        type: 'trips',
        data: activeTrips
      });
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  startPeriodicUpdates() {
    // Update bus locations every 30 seconds
    setInterval(async () => {
      try {
        const activeBuses = await Bus.find({ 'currentStatus.status': 'active' })
          .select('busId currentStatus.location currentStatus.speed currentStatus.direction');
        
        this.io.to('all_buses').emit('busLocationUpdate', {
          type: 'bulk',
          data: activeBuses
        });
      } catch (error) {
        console.error('Error in periodic bus update:', error);
      }
    }, 30000);

    // Update trip progress every minute
    setInterval(async () => {
      try {
        const activeTrips = await Trip.find({ 
          status: { $in: ['boarding', 'departed', 'in_transit'] } 
        }).select('tripId busId status progress');

        this.io.to('all_trips').emit('tripProgressUpdate', {
          type: 'bulk',
          data: activeTrips
        });
      } catch (error) {
        console.error('Error in periodic trip update:', error);
      }
    }, 60000);
  }

  // Method to broadcast bus location update
  broadcastBusLocationUpdate(busId, locationData) {
    this.io.to(`bus:${busId}`).emit('busLocationUpdate', {
      busId,
      ...locationData,
      timestamp: new Date()
    });
    
    this.io.to('all_buses').emit('busLocationUpdate', {
      busId,
      ...locationData,
      timestamp: new Date()
    });
  }

  // Method to broadcast trip progress update
  broadcastTripProgressUpdate(tripId, progressData) {
    this.io.to(`trip:${tripId}`).emit('tripProgressUpdate', {
      tripId,
      ...progressData,
      timestamp: new Date()
    });
    
    this.io.to('all_trips').emit('tripProgressUpdate', {
      tripId,
      ...progressData,
      timestamp: new Date()
    });
  }

  // Method to broadcast system alerts
  broadcastSystemAlert(alertData) {
    this.io.emit('systemAlert', {
      ...alertData,
      timestamp: new Date()
    });
  }

  // Method to get connected clients count
  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  // Method to get client subscriptions
  getClientSubscriptions(socketId) {
    const client = this.connectedClients.get(socketId);
    return client ? Array.from(client.subscriptions) : [];
  }
}

module.exports = SocketService;
