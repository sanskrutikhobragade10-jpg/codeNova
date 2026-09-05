# MetroPark - Smart Two-Wheeler Parking System

MetroPark is an intelligent smart parking platform designed for Metro commuters. It calculates optimal two-wheeler parking facilities near Metro stations using multi-factor optimization (Availability, Distance, Demand Forecast) and provides instant slot reservations with temporary hold countdown timers.

---

## 🚀 How to Run (Easiest Methods)

### Option 1: Instant Browser Launch (Zero Setup Needed)
Simply open the file in your browser:
- Double-click [`frontend/smart-parking-system/index.html`](file:///d:/smart%20parking/frontend/smart-parking-system/index.html)
- Everything will work out-of-the-box using the built-in dynamic engine!

---

### Option 2: Run with Node.js Backend Server
```bash
node server.js
```
Then visit: [http://localhost:3000](http://localhost:3000)

---

### Option 3: Run with Python Backend Server
```bash
python app.py
```
Then visit: [http://localhost:5000](http://localhost:5000)

---

## 🧠 Smart Recommendation Algorithm

Ported directly from C++ ([`parking.cpp`](file:///d:/smart%20parking/parking.cpp)):

1. **Demand Prediction (`predictDemand`)**:
   - `06:00 - 08:00`: Low Demand (Score: 100)
   - `08:00 - 10:00`: High Demand (Score: 30) - Peak Morning Commute
   - `10:00 - 16:00`: Medium Demand (Score: 60)
   - `16:00 - 19:00`: High Demand (Score: 30) - Peak Evening Rush
   - `19:00 - 06:00`: Low Demand (Score: 100)

2. **Availability Score (`calculateAvailability`)**:
   $$\text{Availability Score} = \left(\frac{\text{Available Slots}}{\text{Total Slots}}\right) \times 100$$

3. **Distance Score (`calculateDistanceScore`)**:
   $$\text{Distance Score} = \left(\frac{\text{Farthest Distance} - \text{Parking Distance}}{\text{Farthest Distance} - \text{Closest Distance}}\right) \times 100$$

4. **Smart Recommendation Score (`smartScore`)**:
   $$\text{Smart Score} = (\text{Availability Score} \times 0.40) + (\text{Distance Score} \times 0.30) + (\text{Demand Score} \times 0.30)$$

The parking lot with the highest **Smart Score** is dynamically awarded the `⭐ RECOMMENDED FOR YOU` badge!

---

## 📡 REST API Endpoints

- `GET /api/stations` - Returns all available metro stations
- `GET /api/parking?station=:stationId&hour=:hour` - Returns scored parking lots with dynamic recommendations
- `POST /api/reserve` - Reserves a slot, assigns Booking ID (`MP1001`), and initiates hold window
- `GET /api/bookings` - Fetches active user reservations
- `POST /api/cancel` - Cancels reservation and releases slot back into inventory
