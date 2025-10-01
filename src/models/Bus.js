const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  routeId: {
    type: String,
    required: true,
    ref: 'Route'
  },
  operator: {
    name: {
      type: String,
      required: true
    },
    contact: {
      phone: String,
      email: String
    }
  },
  vehicleInfo: {
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    features: [{
      type: String,
      enum: ['ac', 'wifi', 'usb_charging', 'gps_tracking', 'cctv', 'wheelchair_accessible']
    }]
  },
  currentStatus: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'offline'],
      default: 'inactive'
    },
    location: {
      latitude: {
        type: Number,
        required: function() {
          return this.currentStatus.status === 'active';
        }
      },
      longitude: {
        type: Number,
        required: function() {
          return this.currentStatus.status === 'active';
        }
      },
      address: String,
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    speed: {
      type: Number,
      min: 0,
      max: 200
    },
    direction: {
      type: Number,
      min: 0,
      max: 360
    },
    nextStop: {
      name: String,
      estimatedArrival: Date,
      distance: Number
    }
  },
  currentTrip: {
    tripId: {
      type: String,
      ref: 'Trip'
    },
    startTime: Date,
    expectedEndTime: Date,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  driver: {
    name: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    contact: {
      phone: String
    },
    experience: {
      type: Number,
      min: 0
    }
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    mileage: {
      type: Number,
      min: 0
    },
    issues: [{
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      reportedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['reported', 'in_progress', 'resolved'],
        default: 'reported'
      }
    }]
  },
  locationHistory: [{
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    speed: Number,
    direction: Number,
    accuracy: Number
  }],
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

// Virtual for bus age
busSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.vehicleInfo.year;
});

// Virtual for current location as GeoJSON
busSchema.virtual('currentLocation').get(function() {
  if (this.currentStatus.location.latitude && this.currentStatus.location.longitude) {
    return {
      type: 'Point',
      coordinates: [this.currentStatus.location.longitude, this.currentStatus.location.latitude]
    };
  }
  return null;
});

// Index for geospatial queries
busSchema.index({ 
  'currentStatus.location': '2dsphere'
});

// Index for status and route queries
busSchema.index({ 
  'currentStatus.status': 1,
  routeId: 1
});

// Index for registration number
busSchema.index({ 
  registrationNumber: 1
});

// Pre-save middleware
busSchema.pre('save', function(next) {
  this.metadata.lastModified = new Date();
  this.metadata.version += 1;
  next();
});

// Method to update location
busSchema.methods.updateLocation = function(latitude, longitude, speed = null, direction = null) {
  this.currentStatus.location.latitude = latitude;
  this.currentStatus.location.longitude = longitude;
  this.currentStatus.location.lastUpdated = new Date();
  
  if (speed !== null) this.currentStatus.speed = speed;
  if (direction !== null) this.currentStatus.direction = direction;
  
  // Add to location history (keep last 100 entries)
  this.locationHistory.push({
    latitude,
    longitude,
    timestamp: new Date(),
    speed: speed || this.currentStatus.speed,
    direction: direction || this.currentStatus.direction
  });
  
  // Keep only last 100 location entries
  if (this.locationHistory.length > 100) {
    this.locationHistory = this.locationHistory.slice(-100);
  }
  
  return this.save();
};

// Method to get location history for a time range
busSchema.methods.getLocationHistory = function(startTime, endTime) {
  return this.locationHistory.filter(entry => 
    entry.timestamp >= startTime && entry.timestamp <= endTime
  );
};

// Static method to find buses by status
busSchema.statics.findByStatus = function(status) {
  return this.find({ 'currentStatus.status': status });
};

// Static method to find buses near a location
busSchema.statics.findNearLocation = function(latitude, longitude, maxDistance = 1000) {
  return this.find({
    'currentStatus.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    'currentStatus.status': 'active'
  });
};

module.exports = mongoose.model('Bus', busSchema);
