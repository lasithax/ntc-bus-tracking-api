const mongoose = require('mongoose');
const moment = require('moment');
require('dotenv').config();

const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Trip = require('../models/Trip');

// Sri Lankan inter-provincial bus routes data
const routesData = [
  {
    routeName: "Colombo - Kandy Express",
    origin: {
      city: "Colombo",
      province: "Western",
      coordinates: { latitude: 6.9271, longitude: 79.8612 }
    },
    destination: {
      city: "Kandy",
      province: "Central",
      coordinates: { latitude: 7.2906, longitude: 80.6337 }
    },
    distance: 115,
    estimatedDuration: 180,
    waypoints: [
      { name: "Kadawatha", coordinates: { latitude: 7.0167, longitude: 80.0167 }, order: 1 },
      { name: "Warakapola", coordinates: { latitude: 7.2167, longitude: 80.1667 }, order: 2 },
      { name: "Kegalle", coordinates: { latitude: 7.2500, longitude: 80.3500 }, order: 3 }
    ],
    operator: {
      name: "Sri Lanka Transport Board",
      contact: { phone: "+94-11-2345678", email: "info@sltb.lk" }
    },
    schedule: {
      frequency: "hourly",
      operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      firstTrip: "05:00",
      lastTrip: "22:00"
    }
  },
  {
    routeName: "Colombo - Galle Coastal",
    origin: {
      city: "Colombo",
      province: "Western",
      coordinates: { latitude: 6.9271, longitude: 79.8612 }
    },
    destination: {
      city: "Galle",
      province: "Southern",
      coordinates: { latitude: 6.0329, longitude: 80.2170 }
    },
    distance: 116,
    estimatedDuration: 150,
    waypoints: [
      { name: "Panadura", coordinates: { latitude: 6.7167, longitude: 79.9000 }, order: 1 },
      { name: "Kalutara", coordinates: { latitude: 6.5833, longitude: 79.9667 }, order: 2 },
      { name: "Bentota", coordinates: { latitude: 6.4167, longitude: 80.0000 }, order: 3 },
      { name: "Hikkaduwa", coordinates: { latitude: 6.1333, longitude: 80.1000 }, order: 4 }
    ],
    operator: {
      name: "Southern Express",
      contact: { phone: "+94-11-3456789", email: "info@southernexpress.lk" }
    },
    schedule: {
      frequency: "hourly",
      operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      firstTrip: "05:30",
      lastTrip: "21:30"
    }
  },
  {
    routeName: "Colombo - Anuradhapura",
    origin: {
      city: "Colombo",
      province: "Western",
      coordinates: { latitude: 6.9271, longitude: 79.8612 }
    },
    destination: {
      city: "Anuradhapura",
      province: "North Central",
      coordinates: { latitude: 8.3114, longitude: 80.4037 }
    },
    distance: 205,
    estimatedDuration: 240,
    waypoints: [
      { name: "Kurunegala", coordinates: { latitude: 7.4833, longitude: 80.3667 }, order: 1 },
      { name: "Dambulla", coordinates: { latitude: 7.8667, longitude: 80.6500 }, order: 2 }
    ],
    operator: {
      name: "North Central Transport",
      contact: { phone: "+94-11-4567890", email: "info@nct.lk" }
    },
    schedule: {
      frequency: "daily",
      operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      firstTrip: "06:00",
      lastTrip: "20:00"
    }
  },
  {
    routeName: "Kandy - Nuwara Eliya Hill Country",
    origin: {
      city: "Kandy",
      province: "Central",
      coordinates: { latitude: 7.2906, longitude: 80.6337 }
    },
    destination: {
      city: "Nuwara Eliya",
      province: "Central",
      coordinates: { latitude: 6.9497, longitude: 80.7891 }
    },
    distance: 75,
    estimatedDuration: 120,
    waypoints: [
      { name: "Peradeniya", coordinates: { latitude: 7.2500, longitude: 80.5833 }, order: 1 },
      { name: "Hatton", coordinates: { latitude: 6.9000, longitude: 80.6000 }, order: 2 }
    ],
    operator: {
      name: "Hill Country Transport",
      contact: { phone: "+94-11-5678901", email: "info@hct.lk" }
    },
    schedule: {
      frequency: "daily",
      operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      firstTrip: "07:00",
      lastTrip: "18:00"
    }
  },
  {
    routeName: "Colombo - Trincomalee East Coast",
    origin: {
      city: "Colombo",
      province: "Western",
      coordinates: { latitude: 6.9271, longitude: 79.8612 }
    },
    destination: {
      city: "Trincomalee",
      province: "Eastern",
      coordinates: { latitude: 8.5874, longitude: 81.2152 }
    },
    distance: 265,
    estimatedDuration: 300,
    waypoints: [
      { name: "Kurunegala", coordinates: { latitude: 7.4833, longitude: 80.3667 }, order: 1 },
      { name: "Polonnaruwa", coordinates: { latitude: 7.9333, longitude: 81.0000 }, order: 2 },
      { name: "Batticaloa", coordinates: { latitude: 7.7167, longitude: 81.7000 }, order: 3 }
    ],
    operator: {
      name: "Eastern Transport Services",
      contact: { phone: "+94-11-6789012", email: "info@ets.lk" }
    },
    schedule: {
      frequency: "daily",
      operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      firstTrip: "05:00",
      lastTrip: "19:00"
    }
  }
];

// Bus data with realistic Sri Lankan bus information
const busesData = [
  // Colombo - Kandy Express Buses
  { registrationNumber: "WP-AB-1234", routeId: "RT1", make: "Ashok Leyland", model: "Viking", year: 2020, capacity: 50, features: ["ac", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-CD-5678", routeId: "RT1", make: "Tata", model: "Starbus", year: 2019, capacity: 45, features: ["ac", "wifi", "gps_tracking"] },
  { registrationNumber: "WP-EF-9012", routeId: "RT1", make: "Ashok Leyland", model: "Viking", year: 2021, capacity: 50, features: ["ac", "usb_charging", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-GH-3456", routeId: "RT1", make: "Tata", model: "Starbus", year: 2018, capacity: 45, features: ["ac", "gps_tracking"] },
  { registrationNumber: "WP-IJ-7890", routeId: "RT1", make: "Ashok Leyland", model: "Viking", year: 2022, capacity: 50, features: ["ac", "wifi", "usb_charging", "gps_tracking", "cctv"] },

  // Colombo - Galle Coastal Buses
  { registrationNumber: "WP-KL-2468", routeId: "RT2", make: "Tata", model: "Starbus", year: 2020, capacity: 50, features: ["ac", "gps_tracking"] },
  { registrationNumber: "WP-MN-1357", routeId: "RT2", make: "Ashok Leyland", model: "Viking", year: 2019, capacity: 45, features: ["ac", "wifi", "gps_tracking"] },
  { registrationNumber: "WP-OP-9753", routeId: "RT2", make: "Tata", model: "Starbus", year: 2021, capacity: 50, features: ["ac", "usb_charging", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-QR-8642", routeId: "RT2", make: "Ashok Leyland", model: "Viking", year: 2018, capacity: 45, features: ["ac", "gps_tracking"] },
  { registrationNumber: "WP-ST-6420", routeId: "RT2", make: "Tata", model: "Starbus", year: 2022, capacity: 50, features: ["ac", "wifi", "usb_charging", "gps_tracking", "cctv"] },

  // Colombo - Anuradhapura Buses
  { registrationNumber: "WP-UV-1111", routeId: "RT3", make: "Ashok Leyland", model: "Viking", year: 2020, capacity: 50, features: ["ac", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-WX-2222", routeId: "RT3", make: "Tata", model: "Starbus", year: 2019, capacity: 45, features: ["ac", "wifi", "gps_tracking"] },
  { registrationNumber: "WP-YZ-3333", routeId: "RT3", make: "Ashok Leyland", model: "Viking", year: 2021, capacity: 50, features: ["ac", "usb_charging", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-AA-4444", routeId: "RT3", make: "Tata", model: "Starbus", year: 2018, capacity: 45, features: ["ac", "gps_tracking"] },
  { registrationNumber: "WP-BB-5555", routeId: "RT3", make: "Ashok Leyland", model: "Viking", year: 2022, capacity: 50, features: ["ac", "wifi", "usb_charging", "gps_tracking", "cctv"] },

  // Kandy - Nuwara Eliya Buses
  { registrationNumber: "CP-CC-6666", routeId: "RT4", make: "Tata", model: "Starbus", year: 2020, capacity: 40, features: ["ac", "gps_tracking"] },
  { registrationNumber: "CP-DD-7777", routeId: "RT4", make: "Ashok Leyland", model: "Viking", year: 2019, capacity: 40, features: ["ac", "wifi", "gps_tracking"] },
  { registrationNumber: "CP-EE-8888", routeId: "RT4", make: "Tata", model: "Starbus", year: 2021, capacity: 40, features: ["ac", "usb_charging", "gps_tracking", "cctv"] },
  { registrationNumber: "CP-FF-9999", routeId: "RT4", make: "Ashok Leyland", model: "Viking", year: 2018, capacity: 40, features: ["ac", "gps_tracking"] },
  { registrationNumber: "CP-GG-0000", routeId: "RT4", make: "Tata", model: "Starbus", year: 2022, capacity: 40, features: ["ac", "wifi", "usb_charging", "gps_tracking", "cctv"] },

  // Colombo - Trincomalee Buses
  { registrationNumber: "WP-HH-1111", routeId: "RT5", make: "Ashok Leyland", model: "Viking", year: 2020, capacity: 50, features: ["ac", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-II-2222", routeId: "RT5", make: "Tata", model: "Starbus", year: 2019, capacity: 45, features: ["ac", "wifi", "gps_tracking"] },
  { registrationNumber: "WP-JJ-3333", routeId: "RT5", make: "Ashok Leyland", model: "Viking", year: 2021, capacity: 50, features: ["ac", "usb_charging", "gps_tracking", "cctv"] },
  { registrationNumber: "WP-KK-4444", routeId: "RT5", make: "Tata", model: "Starbus", year: 2018, capacity: 45, features: ["ac", "gps_tracking"] },
  { registrationNumber: "WP-LL-5555", routeId: "RT5", make: "Ashok Leyland", model: "Viking", year: 2022, capacity: 50, features: ["ac", "wifi", "usb_charging", "gps_tracking", "cctv"] }
];

// Driver data
const driversData = [
  { name: "Kumar Perera", licenseNumber: "DL123456", phone: "+94-77-1234567", experience: 15 },
  { name: "Saman Silva", licenseNumber: "DL234567", phone: "+94-77-2345678", experience: 12 },
  { name: "Nimal Fernando", licenseNumber: "DL345678", phone: "+94-77-3456789", experience: 18 },
  { name: "Priya Jayawardena", licenseNumber: "DL456789", phone: "+94-77-4567890", experience: 10 },
  { name: "Ravi Karunaratne", licenseNumber: "DL567890", phone: "+94-77-5678901", experience: 20 },
  { name: "Anura Bandara", licenseNumber: "DL678901", phone: "+94-77-6789012", experience: 14 },
  { name: "Chaminda Rajapaksa", licenseNumber: "DL789012", phone: "+94-77-7890123", experience: 16 },
  { name: "Indika Seneviratne", licenseNumber: "DL890123", phone: "+94-77-8901234", experience: 13 },
  { name: "Sunil Wickramasinghe", licenseNumber: "DL901234", phone: "+94-77-9012345", experience: 17 },
  { name: "Nishantha Gunawardena", licenseNumber: "DL012345", phone: "+94-77-0123456", experience: 11 },
  { name: "Dilshan Mendis", licenseNumber: "DL111111", phone: "+94-77-1111111", experience: 19 },
  { name: "Tharindu Perera", licenseNumber: "DL222222", phone: "+94-77-2222222", experience: 9 },
  { name: "Kasun Jayasuriya", licenseNumber: "DL333333", phone: "+94-77-3333333", experience: 21 },
  { name: "Ruwan Kumara", licenseNumber: "DL444444", phone: "+94-77-4444444", experience: 8 },
  { name: "Suresh Fernando", licenseNumber: "DL555555", phone: "+94-77-5555555", experience: 22 },
  { name: "Lakmal Silva", licenseNumber: "DL666666", phone: "+94-77-6666666", experience: 7 },
  { name: "Dinesh Karunaratne", licenseNumber: "DL777777", phone: "+94-77-7777777", experience: 15 },
  { name: "Prasanna Wijesinghe", licenseNumber: "DL888888", phone: "+94-77-8888888", experience: 12 },
  { name: "Ajith Bandara", licenseNumber: "DL999999", phone: "+94-77-9999999", experience: 16 },
  { name: "Chamara Perera", licenseNumber: "DL000000", phone: "+94-77-0000000", experience: 10 },
  { name: "Nuwan Rathnayake", licenseNumber: "DL121212", phone: "+94-77-1212121", experience: 14 },
  { name: "Sampath Jayasuriya", licenseNumber: "DL131313", phone: "+94-77-1313131", experience: 18 },
  { name: "Dilip Fernando", licenseNumber: "DL141414", phone: "+94-77-1414141", experience: 13 },
  { name: "Nimal Karunaratne", licenseNumber: "DL151515", phone: "+94-77-1515151", experience: 17 },
  { name: "Roshan Silva", licenseNumber: "DL161616", phone: "+94-77-1616161", experience: 11 }
];

async function seedDatabase() {
  try {
    console.log('ðŸŒ± Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ntc-bus-tracking');
    console.log('âœ… Connected to MongoDB');

    // Clear existing data
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Trip.deleteMany({});
    console.log('ðŸ—‘ï¸ Cleared existing data');

    // Create routes
    const routes = [];
    for (let i = 0; i < routesData.length; i++) {
      const routeData = {
        ...routesData[i],
        routeId: `RT${i + 1}`,
        status: 'active'
      };
      const route = new Route(routeData);
      await route.save();
      routes.push(route);
      console.log(`âœ… Created route: ${route.routeName}`);
    }

    // Create buses
    const buses = [];
    for (let i = 0; i < busesData.length; i++) {
      const busData = {
        ...busesData[i],
        busId: `BUS${String(i + 1).padStart(3, '0')}`,
        operator: {
          name: routes[Math.floor(i / 5)].operator.name,
          contact: routes[Math.floor(i / 5)].operator.contact
        },
        driver: driversData[i],
        currentStatus: {
          status: Math.random() > 0.3 ? 'active' : 'inactive',
          location: {
            latitude: routes[Math.floor(i / 5)].origin.coordinates.latitude + (Math.random() - 0.5) * 0.1,
            longitude: routes[Math.floor(i / 5)].origin.coordinates.longitude + (Math.random() - 0.5) * 0.1,
            lastUpdated: new Date()
          },
          speed: Math.floor(Math.random() * 60) + 20,
          direction: Math.floor(Math.random() * 360)
        },
        vehicleInfo: {
          ...busesData[i],
          capacity: busesData[i].capacity
        }
      };

      const bus = new Bus(busData);
      await bus.save();
      buses.push(bus);
      console.log(`âœ… Created bus: ${bus.registrationNumber}`);
    }

    // Create trips for the next 7 days
    const trips = [];
    const today = moment();
    
    for (let day = 0; day < 7; day++) {
      const currentDate = today.clone().add(day, 'days');
      
      for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
        const route = routes[routeIndex];
        const routeBuses = buses.filter(bus => bus.routeId === route.routeId);
        
        // Create 3-5 trips per route per day
        const tripsPerRoute = Math.floor(Math.random() * 3) + 3;
        
        for (let tripIndex = 0; tripIndex < tripsPerRoute; tripIndex++) {
          const bus = routeBuses[Math.floor(Math.random() * routeBuses.length)];
          const driver = driversData[Math.floor(Math.random() * driversData.length)];
          
          // Generate random start time between 5 AM and 8 PM
          const startHour = Math.floor(Math.random() * 15) + 5;
          const startMinute = Math.floor(Math.random() * 60);
          const plannedStartTime = currentDate.clone()
            .hour(startHour)
            .minute(startMinute)
            .second(0);
          
          const plannedEndTime = plannedStartTime.clone()
            .add(route.estimatedDuration, 'minutes');
          
          const tripData = {
            tripId: `TRP${String(trips.length + 1).padStart(4, '0')}`,
            routeId: route.routeId,
            busId: bus.busId,
            driverId: `DRV${String(driversData.indexOf(driver) + 1).padStart(3, '0')}`,
            schedule: {
              plannedStartTime: plannedStartTime.toDate(),
              plannedEndTime: plannedEndTime.toDate()
            },
            status: day === 0 && plannedStartTime.isBefore(moment()) ? 
              (Math.random() > 0.5 ? 'in_transit' : 'completed') : 'scheduled',
            route: {
              origin: route.origin,
              destination: route.destination,
              waypoints: route.waypoints
            },
            passengers: {
              total: Math.floor(Math.random() * bus.vehicleInfo.capacity * 0.8),
              capacity: bus.vehicleInfo.capacity
            }
          };

          const trip = new Trip(tripData);
          await trip.save();
          trips.push(trip);
        }
      }
    }

    console.log(`âœ… Created ${trips.length} trips for 7 days`);

    // Update buses with current trips
    for (let i = 0; i < buses.length; i++) {
      const bus = buses[i];
      const activeTrips = trips.filter(trip => 
        trip.busId === bus.busId && 
        trip.status === 'in_transit' && 
        moment(trip.schedule.plannedStartTime).isSame(moment(), 'day')
      );
      
      if (activeTrips.length > 0) {
        const currentTrip = activeTrips[0];
        bus.currentTrip = {
          tripId: currentTrip.tripId,
          startTime: currentTrip.schedule.plannedStartTime,
          expectedEndTime: currentTrip.schedule.plannedEndTime,
          progress: Math.floor(Math.random() * 80) + 10
        };
        await bus.save();
      }
    }

    console.log('ðŸŽ‰ Database seeding completed successfully!');
    console.log(`ðŸ“Š Summary:`);
    console.log(`   - Routes: ${routes.length}`);
    console.log(`   - Buses: ${buses.length}`);
    console.log(`   - Trips: ${trips.length}`);
    console.log(`   - Drivers: ${driversData.length}`);

  } catch (error) {
    console.error('âŒ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('ðŸ”Œ Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
