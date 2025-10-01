const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    province: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  destination: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    province: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 0
  },
  waypoints: [{
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    order: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
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
  schedule: {
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    operatingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    firstTrip: {
      type: String,
      required: true
    },
    lastTrip: {
      type: String,
      required: true
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

// Virtual for route duration in hours
routeSchema.virtual('durationInHours').get(function() {
  return this.estimatedDuration / 60;
});

// Index for geospatial queries
routeSchema.index({ 
  'origin.coordinates': '2dsphere',
  'destination.coordinates': '2dsphere'
});

// Index for route search
routeSchema.index({ 
  'origin.city': 'text',
  'destination.city': 'text',
  'routeName': 'text'
});

// Pre-save middleware
routeSchema.pre('save', function(next) {
  this.metadata.lastModified = new Date();
  this.metadata.version += 1;
  next();
});

// Static method to find routes by origin and destination
routeSchema.statics.findByOriginDestination = function(originCity, destinationCity) {
  return this.find({
    'origin.city': new RegExp(originCity, 'i'),
    'destination.city': new RegExp(destinationCity, 'i'),
    status: 'active'
  });
};

// Instance method to get route summary
routeSchema.methods.getRouteSummary = function() {
  return {
    routeId: this.routeId,
    routeName: this.routeName,
    origin: `${this.origin.city}, ${this.origin.province}`,
    destination: `${this.destination.city}, ${this.destination.province}`,
    distance: this.distance,
    estimatedDuration: this.estimatedDuration,
    status: this.status
  };
};

module.exports = mongoose.model('Route', routeSchema);
