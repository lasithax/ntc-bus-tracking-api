const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  routeId: {
    type: String,
    required: true,
    ref: 'Route'
  },
  busId: {
    type: String,
    required: true,
    ref: 'Bus'
  },
  driverId: {
    type: String,
    required: true
  },
  schedule: {
    plannedStartTime: {
      type: Date,
      required: true
    },
    plannedEndTime: {
      type: Date,
      required: true
    },
    actualStartTime: Date,
    actualEndTime: Date,
    departureDelay: {
      type: Number,
      default: 0
    },
    arrivalDelay: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'in_transit', 'arrived', 'completed', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  progress: {
    currentStop: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      order: Number
    },
    nextStop: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      order: Number,
      estimatedArrival: Date,
      distance: Number
    },
    completedStops: [{
      stopName: String,
      order: Number,
      actualArrival: Date,
      actualDeparture: Date,
      delay: Number
    }],
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  passengers: {
    total: {
      type: Number,
      min: 0,
      default: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    occupancy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  route: {
    origin: {
      city: String,
      province: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    destination: {
      city: String,
      province: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    waypoints: [{
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      order: Number,
      estimatedArrival: Date,
      actualArrival: Date,
      delay: Number
    }]
  },
  tracking: {
    currentLocation: {
      latitude: Number,
      longitude: Number,
      timestamp: Date,
      accuracy: Number
    },
    speed: {
      current: Number,
      average: Number,
      max: Number
    },
    direction: Number,
    distanceTraveled: {
      type: Number,
      default: 0
    },
    remainingDistance: Number,
    estimatedArrival: Date
  },
  incidents: [{
    type: {
      type: String,
      enum: ['breakdown', 'traffic', 'weather', 'accident', 'other'],
      required: true
    },
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    impact: {
      delay: Number,
      affectedPassengers: Number
    }
  }],
  performance: {
    onTimePerformance: {
      type: Number,
      min: 0,
      max: 100
    },
    averageSpeed: Number,
    fuelEfficiency: Number,
    driverRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  metadata: {
    createdBy: {
      type: String,
      default: 'system'
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trip duration
tripSchema.virtual('duration').get(function() {
  if (this.schedule.actualStartTime && this.schedule.actualEndTime) {
    return this.schedule.actualEndTime - this.schedule.actualStartTime;
  }
  return this.schedule.plannedEndTime - this.schedule.plannedStartTime;
});

// Virtual for trip status summary
tripSchema.virtual('statusSummary').get(function() {
  return {
    tripId: this.tripId,
    status: this.status,
    progress: this.progress.percentage,
    currentStop: this.progress.currentStop?.name,
    nextStop: this.progress.nextStop?.name,
    estimatedArrival: this.progress.nextStop?.estimatedArrival,
    occupancy: this.passengers.occupancy
  };
});

// Index for trip queries
tripSchema.index({ 
  routeId: 1,
  busId: 1,
  status: 1
});

tripSchema.index({ 
  'schedule.plannedStartTime': 1,
  'schedule.plannedEndTime': 1
});

tripSchema.index({ 
  status: 1,
  'schedule.plannedStartTime': 1
});

// Pre-save middleware
tripSchema.pre('save', function(next) {
  this.metadata.lastModified = new Date();
  this.metadata.version += 1;
  
  // Calculate occupancy percentage
  if (this.passengers.total && this.passengers.capacity) {
    this.passengers.occupancy = Math.round((this.passengers.total / this.passengers.capacity) * 100);
  }
  
  next();
});

// Method to update trip progress
tripSchema.methods.updateProgress = function(currentLocation, nextStop, percentage) {
  this.tracking.currentLocation = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    timestamp: new Date()
  };
  
  this.progress.currentStop = currentLocation.stop || this.progress.currentStop;
  this.progress.nextStop = nextStop;
  this.progress.percentage = Math.min(100, Math.max(0, percentage));
  
  return this.save();
};

// Method to add incident
tripSchema.methods.addIncident = function(incidentData) {
  this.incidents.push({
    ...incidentData,
    reportedAt: new Date()
  });
  
  // Update status to delayed if incident is severe
  if (incidentData.severity === 'high' || incidentData.severity === 'critical') {
    this.status = 'delayed';
  }
  
  return this.save();
};

// Method to complete trip
tripSchema.methods.completeTrip = function() {
  this.status = 'completed';
  this.schedule.actualEndTime = new Date();
  this.progress.percentage = 100;
  
  // Calculate delays
  if (this.schedule.actualStartTime && this.schedule.plannedStartTime) {
    this.schedule.departureDelay = this.schedule.actualStartTime - this.schedule.plannedStartTime;
  }
  
  if (this.schedule.actualEndTime && this.schedule.plannedEndTime) {
    this.schedule.arrivalDelay = this.schedule.actualEndTime - this.schedule.plannedEndTime;
  }
  
  return this.save();
};

// Static method to find active trips
tripSchema.statics.findActiveTrips = function() {
  return this.find({
    status: { $in: ['boarding', 'departed', 'in_transit'] }
  });
};

// Static method to find trips by route and date
tripSchema.statics.findByRouteAndDate = function(routeId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    routeId,
    'schedule.plannedStartTime': {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
};

module.exports = mongoose.model('Trip', tripSchema);
