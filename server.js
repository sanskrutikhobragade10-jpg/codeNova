// Smart Parking System - Lightweight Node.js Backend Server
// Built with native Node.js HTTP module (Zero external dependencies required)

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend', 'smart-parking-system');

// ================= METROPARK CONFIGURATION =================

const METROPARK_CONFIG = {
    reservationHoldMinutes: 15,

    defaultMetroOpenTime: '06:00',
    defaultMetroCloseTime: '23:00',

    defaultParkingOpenTime: '05:30',
    defaultParkingCloseTime: '23:30'
};

// Station and Parking Dataset (Initial state matching C++ backend)
const stationData = {
    'sitabuldi': {
        name: 'Sitabuldi Interchange',
        latitude: 21.14152,
        longitude: 79.08315,
        parkings: [
            { id: 'A', name: 'Munje Square Concourse', totalSlots: 50, availableSlots: 14, distance: 120 },
            { id: 'B', name: 'Tekdi Road Parking Bay', totalSlots: 60, availableSlots: 35, distance: 230 },
            { id: 'C', name: 'Buty Plaza South Lot', totalSlots: 45, availableSlots: 28, distance: 380 }
        ]
    },
    'zero-mile': {
        name: 'Zero Mile Freedom Park',
        latitude: 21.14666,
        longitude: 79.08057,
        parkings: [
            { id: 'A', name: 'Freedom Park North Bay', totalSlots: 40, availableSlots: 10, distance: 110 },
            { id: 'B', name: 'Civil Lines Concourse', totalSlots: 50, availableSlots: 26, distance: 220 },
            { id: 'C', name: 'RBI Square East Deck', totalSlots: 45, availableSlots: 32, distance: 390 }
        ]
    },
    'jaiprakash-nagar': {
        name: 'Jaiprakash Nagar (Wardha Road)',
        latitude: 21.10370,
        longitude: 79.06824,
        parkings: [
            { id: 'A', name: 'Parking A (West Bay)', totalSlots: 20, availableSlots: 5, distance: 150 },
            { id: 'B', name: 'Parking B (Main Concourse)', totalSlots: 30, availableSlots: 18, distance: 250 },
            { id: 'C', name: 'Parking C (Khamla Road Lot)', totalSlots: 40, availableSlots: 25, distance: 400 }
        ]
    },
    'airport': {
        name: 'Airport Metro Station (Sonegaon)',
        latitude: 21.08631,
        longitude: 79.06393,
        parkings: [
            { id: 'A', name: 'Terminal 1 Commuter Lot', totalSlots: 50, availableSlots: 12, distance: 130 },
            { id: 'B', name: 'Sonegaon North Bay', totalSlots: 40, availableSlots: 28, distance: 240 },
            { id: 'C', name: 'Aerodrome South Deck', totalSlots: 60, availableSlots: 42, distance: 410 }
        ]
    },
    'congress-nagar': {
        name: 'Congress Nagar (Ajni)',
        latitude: 21.12781,
        longitude: 79.08020,
        parkings: [
            { id: 'A', name: 'Platform 1 Ajni Link', totalSlots: 30, availableSlots: 6, distance: 140 },
            { id: 'B', name: 'Dhantoli Garden Parking', totalSlots: 40, availableSlots: 22, distance: 260 },
            { id: 'C', name: 'Congress Nagar East Bay', totalSlots: 45, availableSlots: 31, distance: 420 }
        ]
    },
    'rahate-colony': {
        name: 'Rahate Colony (NEERI / Wardha Rd)',
        latitude: 21.12789,
        longitude: 79.07361,
        parkings: [
            { id: 'A', name: 'NEERI Gate Concourse', totalSlots: 35, availableSlots: 9, distance: 160 },
            { id: 'B', name: 'Wardha Road West Bay', totalSlots: 45, availableSlots: 27, distance: 270 },
            { id: 'C', name: 'Medical Square South Lot', totalSlots: 50, availableSlots: 36, distance: 440 }
        ]
    },
    'kasturchand-park': {
        name: 'Kasturchand Park (Kingsway)',
        latitude: 21.15440,
        longitude: 79.07930,
        parkings: [
            { id: 'A', name: 'KP Ground North Lot', totalSlots: 55, availableSlots: 16, distance: 140 },
            { id: 'B', name: 'Kingsway Station Parking', totalSlots: 50, availableSlots: 31, distance: 250 },
            { id: 'C', name: 'Mohota Science Concourse', totalSlots: 40, availableSlots: 26, distance: 390 }
        ]
    },
    'automotive-square': {
        name: 'Automotive Square (Kamptee Road)',
        latitude: 21.18595,
        longitude: 79.11997,
        parkings: [
            { id: 'A', name: 'Kamptee Road Terminal Plaza', totalSlots: 60, availableSlots: 18, distance: 150 },
            { id: 'B', name: 'Automotive Junction Bay', totalSlots: 50, availableSlots: 32, distance: 260 },
            { id: 'C', name: 'Uppalwadi Commuter Deck', totalSlots: 45, availableSlots: 30, distance: 430 }
        ]
    },
    'dharampeth-college': {
        name: 'Dharampeth College (Shankar Nagar)',
        latitude: 21.12869,
        longitude: 79.04353,
        parkings: [
            { id: 'A', name: 'WHC Road North Bay', totalSlots: 35, availableSlots: 8, distance: 130 },
            { id: 'B', name: 'Shankar Nagar Square Lot', totalSlots: 45, availableSlots: 25, distance: 240 },
            { id: 'C', name: 'Laxmi Bhuvan Deck', totalSlots: 50, availableSlots: 34, distance: 390 }
        ]
    },
    'subhash-nagar': {
        name: 'Subhash Nagar (Ambazari / VNIT)',
        latitude: 21.12330,
        longitude: 79.03971,
        parkings: [
            { id: 'A', name: 'Ambazari Garden Bay', totalSlots: 40, availableSlots: 11, distance: 140 },
            { id: 'B', name: 'VNIT Gate 2 Parking', totalSlots: 50, availableSlots: 29, distance: 250 },
            { id: 'C', name: 'Subhash Nagar Concourse', totalSlots: 45, availableSlots: 33, distance: 400 }
        ]
    },
    'lokmanya-nagar': {
        name: 'Lokmanya Nagar (Hingna MIDC)',
        latitude: 21.11072,
        longitude: 79.00162,
        parkings: [
            { id: 'A', name: 'Hingna MIDC Commuter Bay', totalSlots: 65, availableSlots: 20, distance: 120 },
            { id: 'B', name: 'IC Square Parking Lot', totalSlots: 50, availableSlots: 33, distance: 240 },
            { id: 'C', name: 'Yashwant Nagar Concourse', totalSlots: 45, availableSlots: 30, distance: 390 }
        ]
    },
    'prajapati-nagar': {
        name: 'Prajapati Nagar (Pardi / Bhandara Rd)',
        latitude: 21.15012,
        longitude: 79.14872,
        parkings: [
            { id: 'A', name: 'Bhandara Road Terminal Bay', totalSlots: 55, availableSlots: 15, distance: 150 },
            { id: 'B', name: 'Pardi Flyover Parking', totalSlots: 50, availableSlots: 28, distance: 270 },
            { id: 'C', name: 'Kapsi Road Commuter Deck', totalSlots: 40, availableSlots: 26, distance: 410 }
        ]
        },

    // ================= INDORE METRO =================

    'indore-terminal': {
        name: 'Devi Ahilya Bai Holkar Terminal',
        city: 'Indore',
        latitude: 22.7196,
        longitude: 75.8577,
        parkings: [
            { id: 'A', name: 'Terminal Parking Bay', totalSlots: 60, availableSlots: 25, distance: 120 },
            { id: 'B', name: 'Terminal Commuter Parking', totalSlots: 50, availableSlots: 20, distance: 250 },
            { id: 'C', name: 'Main Road Parking Deck', totalSlots: 40, availableSlots: 18, distance: 380 }
        ]
    },

    'indore-mlb': {
        name: 'Maharani Lakshmi Bai',
        city: 'Indore',
        latitude: 22.74533,
        longitude: 75.80092,
        parkings: [
            { id: 'A', name: 'MLB Metro Parking', totalSlots: 55, availableSlots: 22, distance: 140 },
            { id: 'B', name: 'MLB Commuter Parking', totalSlots: 45, availableSlots: 18, distance: 280 },
            { id: 'C', name: 'MLB Roadside Parking', totalSlots: 35, availableSlots: 12, distance: 420 }
        ]
    },

    'indore-rani-avanti-bai': {
        name: 'Rani Avanti Bai Lodhi',
        city: 'Indore',
        latitude: 22.75408,
        longitude: 75.80425,
        parkings: [
            { id: 'A', name: 'Station Parking A', totalSlots: 50, availableSlots: 18, distance: 130 },
            { id: 'B', name: 'Station Parking B', totalSlots: 45, availableSlots: 20, distance: 260 },
            { id: 'C', name: 'Commuter Parking Zone', totalSlots: 35, availableSlots: 15, distance: 390 }
        ]
    },

    'indore-rani-durgavati': {
        name: 'Rani Durgavati',
        city: 'Indore',
        latitude: 22.7631,
        longitude: 75.8483,
        parkings: [
            { id: 'A', name: 'Rani Durgavati Parking', totalSlots: 50, availableSlots: 21, distance: 150 },
            { id: 'B', name: 'Metro Commuter Bay', totalSlots: 40, availableSlots: 16, distance: 290 },
            { id: 'C', name: 'Extended Parking Zone', totalSlots: 35, availableSlots: 14, distance: 430 }
        ]
    },

    'indore-jhalkari-bai': {
        name: 'Veerangana Jhalkari Bai',
        city: 'Indore',
        latitude: 22.7718,
        longitude: 75.85,
        parkings: [
            { id: 'A', name: 'Jhalkari Bai Parking A', totalSlots: 55, availableSlots: 24, distance: 110 },
            { id: 'B', name: 'Jhalkari Bai Parking B', totalSlots: 45, availableSlots: 19, distance: 270 },
            { id: 'C', name: 'Commuter Parking Deck', totalSlots: 40, availableSlots: 17, distance: 400 }
        ]
    },

    'indore-railway-station': {
        name: 'Indore Railway Station',
        city: 'Indore',
        latitude: 22.7170,
        longitude: 75.8685,
        parkings: [
            { id: 'A', name: 'Railway Station Parking Bay', totalSlots: 70, availableSlots: 30, distance: 100 },
            { id: 'B', name: 'Railway Commuter Parking', totalSlots: 55, availableSlots: 24, distance: 220 },
            { id: 'C', name: 'Station Road Parking Deck', totalSlots: 45, availableSlots: 18, distance: 360 }
        ]
    },

    'indore-chandragupta-square': {
        name: 'Chandragupta Square',
        city: 'Indore',
        latitude: 22.76479,
        longitude: 75.86983,
        parkings: [
            { id: 'A', name: 'Chandragupta Metro Parking', totalSlots: 60, availableSlots: 26, distance: 130 },
            { id: 'B', name: 'Square Commuter Parking', totalSlots: 50, availableSlots: 21, distance: 270 },
            { id: 'C', name: 'Extended Parking Zone', totalSlots: 40, availableSlots: 16, distance: 410 }
        ]
    },

    'indore-mr10-road': {
        name: 'MR-10 Road',
        city: 'Indore',
        latitude: 22.78283,
        longitude: 75.85436,
        parkings: [
            { id: 'A', name: 'MR-10 Metro Parking', totalSlots: 65, availableSlots: 28, distance: 150 },
            { id: 'B', name: 'MR-10 Commuter Bay', totalSlots: 50, availableSlots: 22, distance: 290 },
            { id: 'C', name: 'MR-10 Extended Parking', totalSlots: 45, availableSlots: 19, distance: 430 }
        ]
    },
        // ================= BHOPAL METRO =================

    'bhopal-aiims': {
        name: 'AIIMS',
        city: 'Bhopal',
        latitude: 23.2095,
        longitude: 77.4581,
        parkings: [
            { id: 'A', name: 'AIIMS Metro Parking', totalSlots: 60, availableSlots: 25, distance: 120 },
            { id: 'B', name: 'AIIMS Commuter Parking', totalSlots: 50, availableSlots: 21, distance: 260 },
            { id: 'C', name: 'AIIMS Extended Parking', totalSlots: 40, availableSlots: 17, distance: 400 }
        ]
    },

    'bhopal-alakapuri': {
        name: 'Alkapuri',
        city: 'Bhopal',
        latitude: 23.2165,
        longitude: 77.4475,
        parkings: [
            { id: 'A', name: 'Alkapuri Metro Parking', totalSlots: 55, availableSlots: 23, distance: 140 },
            { id: 'B', name: 'Alkapuri Commuter Bay', totalSlots: 45, availableSlots: 19, distance: 280 },
            { id: 'C', name: 'Alkapuri Extended Parking', totalSlots: 35, availableSlots: 14, distance: 420 }
        ]
    },

    'bhopal-drm-office': {
        name: 'DRM Office',
        city: 'Bhopal',
        latitude: 23.2265,
        longitude: 77.4397,

        parkings: [
            { id: 'A', name: 'DRM Office Parking', totalSlots: 50, availableSlots: 20, distance: 130 },
            { id: 'B', name: 'DRM Commuter Parking', totalSlots: 45, availableSlots: 18, distance: 270 },
            { id: 'C', name: 'DRM Extended Parking', totalSlots: 35, availableSlots: 13, distance: 410 }
        ]
    },

    'bhopal-rani-kamlapati': {
        name: 'Rani Kamlapati',
        city: 'Bhopal',
        latitude: 23.22127,
        longitude: 77.43835,
        parkings: [
            { id: 'A', name: 'Rani Kamlapati Parking', totalSlots: 70, availableSlots: 28, distance: 100 },
            { id: 'B', name: 'Station Commuter Parking', totalSlots: 55, availableSlots: 22, distance: 240 },
            { id: 'C', name: 'Station Road Parking Deck', totalSlots: 45, availableSlots: 18, distance: 380 }
        ]
    },

    'bhopal-mp-nagar': {
        name: 'MP Nagar',
        city: 'Bhopal',
        latitude: 23.2330,
        longitude: 77.4340,
        parkings: [
            { id: 'A', name: 'MP Nagar Metro Parking', totalSlots: 65, availableSlots: 26, distance: 120 },
            { id: 'B', name: 'MP Nagar Commuter Bay', totalSlots: 50, availableSlots: 20, distance: 260 },
            { id: 'C', name: 'MP Nagar Extended Parking', totalSlots: 40, availableSlots: 15, distance: 400 }
        ]
    },

    'bhopal-board-office': {
        name: 'Board Office Chauraha',
        city: 'Bhopal',
        latitude: 23.2316,
        longitude: 77.4327,
        parkings: [
            { id: 'A', name: 'Board Office Parking', totalSlots: 55, availableSlots: 22, distance: 130 },
            { id: 'B', name: 'Board Office Commuter Parking', totalSlots: 45, availableSlots: 17, distance: 280 },
            { id: 'C', name: 'Chauraha Extended Parking', totalSlots: 35, availableSlots: 12, distance: 420 }
        ]
    },

    'bhopal-kendriya-vidyalaya': {
        name: 'Kendriya Vidyalaya',
        city: 'Bhopal',
        latitude: 23.2268,
        longitude: 77.4372,
        parkings: [
            { id: 'A', name: 'KV Metro Parking', totalSlots: 50, availableSlots: 21, distance: 150 },
            { id: 'B', name: 'KV Commuter Parking', totalSlots: 40, availableSlots: 16, distance: 290 },
            { id: 'C', name: 'KV Extended Parking', totalSlots: 35, availableSlots: 14, distance: 430 }
        ]
    },

    'bhopal-subhash-nagar': {
        name: 'Subhash Nagar',
        city: 'Bhopal',
        latitude: 23.2184,
        longitude: 77.4351,
        parkings: [
            { id: 'A', name: 'Subhash Nagar Metro Parking', totalSlots: 60, availableSlots: 24, distance: 110 },
            { id: 'B', name: 'Subhash Nagar Commuter Bay', totalSlots: 50, availableSlots: 20, distance: 270 },
            { id: 'C', name: 'Subhash Nagar Extended Parking', totalSlots: 40, availableSlots: 16, distance: 410 }
        ]
    }
    
};
    

Object.values(stationData).forEach(station => {
    station.city = station.city || "Nagpur";
});

// In-Memory Bookings Store
let bookingCounter = 1001;
const activeBookings = [];

// ================= C++ CORE ALGORITHMS =================

// 1. Demand Prediction (Matches C++ predictDemand)

function predictDemand(hour) {
    if (hour >= 8 && hour <= 10) {
        return {
            level: 'High',
            score: 80
        };
    }

    if (hour >= 17 && hour <= 20) {
        return {
            level: 'High',
            score: 85
        };
    }

    if (hour >= 11 && hour <= 16) {
        return {
            level: 'Medium',
            score: 55
        };
    }

    return {
        level: 'Low',
        score: 25
    };
}

// 2. Demand Score (Matches C++ calculateDemandScore)
function calculateDemandScore(demand) {
    if (demand === 'Low') return 100;
    if (demand === 'Medium') return 60;
    return 30; // High
}

// 3. Availability Score (Matches C++ calculateAvailability)
function calculateAvailability(parking) {
    if (parking.totalSlots === 0) return 0;
    return (parking.availableSlots / parking.totalSlots) * 100;
}

// 4. Distance Score (Matches C++ calculateDistanceScore)
function calculateDistanceScore(parking, closestDistance, farthestDistance) {
    if (farthestDistance === closestDistance) return 100;
    return ((farthestDistance - parking.distance) / (farthestDistance - closestDistance)) * 100;
}

// 5. Smart Recommendation Computation (Matches C++ smartScore)
function computeSmartScores(parkings, currentHour) {
    const demand = predictDemand(currentHour);
    const demandScore = calculateDemandScore(demand);

    const distances = parkings.map(p => p.distance);
    const closestDistance = Math.min(...distances);
    const farthestDistance = Math.max(...distances);

    const scoredParkings = parkings.map(parking => {
        const availability = calculateAvailability(parking);
        const distanceScore = calculateDistanceScore(parking, closestDistance, farthestDistance);
        
        // Smart Score Formula: 40% Availability + 30% Distance + 30% Demand
        const smartScore = (availability * 0.40) + (distanceScore * 0.30) + (demandScore * 0.30);

        return {
            ...parking,
            availabilityScore: Math.round(availability * 10) / 10,
            distanceScore: Math.round(distanceScore * 10) / 10,
            demand,
            demandScore,
            smartScore: Math.round(smartScore * 10) / 10
        };
    });

    // Find highest smart score
    let highestScore = -1;
    let recommendedId = null;

    scoredParkings.forEach(p => {
        if (p.smartScore > highestScore) {
            highestScore = p.smartScore;
            recommendedId = p.id;
        }
    });

    return scoredParkings.map(p => ({
        ...p,
        isRecommended: p.id === recommendedId
    }));
}

// ================= HTTP SERVER & ROUTER =================

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Helper for JSON response
    const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    // Helper to read POST body
    const readBody = (callback) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const parsed = body ? JSON.parse(body) : {};
                callback(parsed);
            } catch (err) {
                sendJSON(400, { error: 'Invalid JSON payload' });
            }
        });
    };
    function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function predictDemand(hour) {
    if (hour >= 8 && hour <= 10) {
        return {
            level: 'High',
            score: 80
        };
    }

    if (hour >= 17 && hour <= 20) {
        return {
            level: 'High',
            score: 85
        };
    }

    if (hour >= 11 && hour <= 16) {
        return {
            level: 'Medium',
            score: 55
        };
    }

    return {
        level: 'Low',
        score: 25
    };

    function predictDemand(hour) {
    // your prediction code
}

function calculateRecommendationScore(distance, availableSlots, demandScore) {
    const distanceScore = Math.max(0, 100 - (distance * 10));
    const availabilityScore = Math.min(100, availableSlots);

    return Number(
        (
            distanceScore * 0.4 +
            availabilityScore * 0.3 +
            (100 - demandScore) * 0.3
        ).toFixed(2)
    );
}

// ---------- API ENDPOINTS ----------
}

    // ---------- API ENDPOINTS ----------

   // 0. GET /api/cities
if (pathname === '/api/cities' && method === 'GET') {
    const cities = [...new Set(
        Object.values(stationData).map(station => station.city)
    )];

    return sendJSON(200, { cities });
}

    
// GET /api/nearest-station
if (pathname === '/api/nearest-station' && method === 'GET') {
    const lat = parseFloat(parsedUrl.query.lat);
    const lon = parseFloat(parsedUrl.query.lon);
    const selectedCity = parsedUrl.query.city;

    if (isNaN(lat) || isNaN(lon)) {
        return sendJSON(400, {
            error: 'Latitude and longitude are required'
        });
    }

    const nearbyStations = Object.entries(stationData)
    .filter(([id, station]) =>
        station.latitude &&
        station.longitude &&
        (!selectedCity || station.city === selectedCity)
    )
        .map(([id, station]) => {

            const totalAvailableSlots = station.parkings.reduce(
                (sum, parking) => sum + parking.availableSlots,
                0
            );
            const currentHour = new Date().getHours();
            const demandPrediction = predictDemand(currentHour);

            return {
                id,
                name: station.name,
                city: station.city,
                distance: Number(
                    calculateDistance(
                        lat,
                        lon,
                        station.latitude,
                        station.longitude
                    ).toFixed(2)
                ),
                availableSlots: totalAvailableSlots,
                demandLevel: demandPrediction.level,
                demandScore: demandPrediction.score,
            };
            
        })
        .sort((a, b) => a.distance - b.distance);

    // Find nearest station that has at least one slot
    const recommendedStation = nearbyStations.find(
        station => station.availableSlots > 0
    );

    return sendJSON(200, {
        userLocation: {
            latitude: lat,
            longitude: lon
        },
        recommendedStation,
        stations: nearbyStations
    });
}

    // 2. GET /api/parking?station=jaiprakash-nagar&hour=9
    if (pathname === '/api/parking' && method === 'GET') {
        const stationId = parsedUrl.query.station || 'jaiprakash-nagar';
        const currentHour = parsedUrl.query.hour ? parseInt(parsedUrl.query.hour, 10) : new Date().getHours();

        const station = stationData[stationId];
        if (!station) {
            return sendJSON(404, { error: 'Station not found' });
        }

        const computedParkings = computeSmartScores(station.parkings, currentHour);
        return sendJSON(200, {
            stationId,
            stationName: station.name,
            currentHour,
            demand: predictDemand(currentHour),
            parkings: computedParkings
        });
    }

    // 3. POST /api/reserve
    if (pathname === '/api/reserve' && method === 'POST') {
        return readBody((data) => {
            const { stationId, parkingId, slotNumber } = data;
            const station = stationData[stationId];
            if (!station) return sendJSON(404, { error: 'Station not found' });

            const parking = station.parkings.find(p => p.id === parkingId);
            if (!parking) return sendJSON(404, { error: 'Parking facility not found' });

            if (parking.availableSlots <= 0) {
                return sendJSON(400, { error: 'No slots available in ' + parking.name });
            }

            // Decrement slot (Matches C++ parking.availableSlots--)
            parking.availableSlots--;

            const bookingId = 'MP' + (bookingCounter++);
            const assignedSlot = slotNumber || `${parking.id}-${String(parking.totalSlots - parking.availableSlots).padStart(2, '0')}`;
            const expirationTime = Date.now() + (15 * 60 * 1000); // 15 minute temporary hold
            const newBooking = {
                bookingId,
                stationId,
                stationName: station.name,
                parkingId: parking.id,
                parkingName: parking.name,
                distance: parking.distance,
                slotNumber: assignedSlot,
                reservedAt: new Date().toISOString(),
                expiresAt: new Date(expirationTime).toISOString(),
                expiresAtTimestamp: expirationTime,
                status: 'ACTIVE'
            };

            activeBookings.push(newBooking);

            return sendJSON(201, {
                success: true,
                message: 'Slot reserved successfully',
                booking: newBooking,
                remainingSlots: parking.availableSlots
            });
        });
    }

    // 4. GET /api/bookings
    if (pathname === '/api/bookings' && method === 'GET') {
        const now = Date.now();
        // Auto-expire past bookings (Matches C++ expireReservation)
        activeBookings.forEach(booking => {
            if (booking.status === 'ACTIVE' && booking.expiresAtTimestamp <= now) {
                booking.status = 'EXPIRED';
                const station = stationData[booking.stationId];
                if (station) {
                    const parking = station.parkings.find(p => p.id === booking.parkingId);
                    if (parking) parking.availableSlots = Math.min(parking.totalSlots, parking.availableSlots + 1);
                }
            }
        });
        return sendJSON(200, { bookings: activeBookings });
    }

    // 5. POST /api/cancel
    if (pathname === '/api/cancel' && method === 'POST') {
        return readBody((data) => {
            const { bookingId } = data;
            const booking = activeBookings.find(b => b.bookingId === bookingId);
            if (!booking) return sendJSON(404, { error: 'Booking not found' });

            if (booking.status === 'ACTIVE') {
                booking.status = 'CANCELLED';
                const station = stationData[booking.stationId];
                if (station) {
                    const parking = station.parkings.find(p => p.id === booking.parkingId);
                    if (parking) parking.availableSlots = Math.min(parking.totalSlots, parking.availableSlots + 1);
                }
            }

            return sendJSON(200, { success: true, message: 'Reservation cancelled' });
        });
    }

    // ---------- STATIC FILE SERVING ----------
    let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);

    const extname = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Smart Parking System Backend Server is Running!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api/parking`);
    console.log(`=================================================\n`);
});
