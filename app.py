# Smart Parking System - Robust Python Backend Server
# Built with Python standard library (Zero third-party pip dependencies required)

import http.server
import socketserver
import json
import os
import urllib.parse
import time
import mimetypes
from datetime import datetime

DEFAULT_PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend', 'smart-parking-system')

# Station & Parking Dataset (Matches C++ parking.cpp)
station_data = {
    'sitabuldi': {
        'name': 'Sitabuldi Interchange',
        'parkings': [
            {'id': 'A', 'name': 'Munje Square Concourse', 'totalSlots': 50, 'availableSlots': 14, 'distance': 120},
            {'id': 'B', 'name': 'Tekdi Road Parking Bay', 'totalSlots': 60, 'availableSlots': 35, 'distance': 230},
            {'id': 'C', 'name': 'Buty Plaza South Lot', 'totalSlots': 45, 'availableSlots': 28, 'distance': 380}
        ]
    },
    'zero-mile': {
        'name': 'Zero Mile Freedom Park',
        'parkings': [
            {'id': 'A', 'name': 'Freedom Park North Bay', 'totalSlots': 40, 'availableSlots': 10, 'distance': 110},
            {'id': 'B', 'name': 'Civil Lines Concourse', 'totalSlots': 50, 'availableSlots': 26, 'distance': 220},
            {'id': 'C', 'name': 'RBI Square East Deck', 'totalSlots': 45, 'availableSlots': 32, 'distance': 390}
        ]
    },
    'jaiprakash-nagar': {
        'name': 'Jaiprakash Nagar (Wardha Road)',
        'parkings': [
            {'id': 'A', 'name': 'Parking A (West Bay)', 'totalSlots': 20, 'availableSlots': 5, 'distance': 150},
            {'id': 'B', 'name': 'Parking B (Main Concourse)', 'totalSlots': 30, 'availableSlots': 18, 'distance': 250},
            {'id': 'C', 'name': 'Parking C (Khamla Road Lot)', 'totalSlots': 40, 'availableSlots': 25, 'distance': 400}
        ]
    },
    'airport': {
        'name': 'Airport Metro Station (Sonegaon)',
        'parkings': [
            {'id': 'A', 'name': 'Terminal 1 Commuter Lot', 'totalSlots': 50, 'availableSlots': 12, 'distance': 130},
            {'id': 'B', 'name': 'Sonegaon North Bay', 'totalSlots': 40, 'availableSlots': 28, 'distance': 240},
            {'id': 'C', 'name': 'Aerodrome South Deck', 'totalSlots': 60, 'availableSlots': 42, 'distance': 410}
        ]
    },
    'congress-nagar': {
        'name': 'Congress Nagar (Ajni)',
        'parkings': [
            {'id': 'A', 'name': 'Platform 1 Ajni Link', 'totalSlots': 30, 'availableSlots': 6, 'distance': 140},
            {'id': 'B', 'name': 'Dhantoli Garden Parking', 'totalSlots': 40, 'availableSlots': 22, 'distance': 260},
            {'id': 'C', 'name': 'Congress Nagar East Bay', 'totalSlots': 45, 'availableSlots': 31, 'distance': 420}
        ]
    },
    'rahate-colony': {
        'name': 'Rahate Colony (NEERI / Wardha Rd)',
        'parkings': [
            {'id': 'A', 'name': 'NEERI Gate Concourse', 'totalSlots': 35, 'availableSlots': 9, 'distance': 160},
            {'id': 'B', 'name': 'Wardha Road West Bay', 'totalSlots': 45, 'availableSlots': 27, 'distance': 270},
            {'id': 'C', 'name': 'Medical Square South Lot', 'totalSlots': 50, 'availableSlots': 36, 'distance': 440}
        ]
    },
    'kasturchand-park': {
        'name': 'Kasturchand Park (Kingsway)',
        'parkings': [
            {'id': 'A', 'name': 'KP Ground North Lot', 'totalSlots': 55, 'availableSlots': 16, 'distance': 140},
            {'id': 'B', 'name': 'Kingsway Station Parking', 'totalSlots': 50, 'availableSlots': 31, 'distance': 250},
            {'id': 'C', 'name': 'Mohota Science Concourse', 'totalSlots': 40, 'availableSlots': 26, 'distance': 390}
        ]
    },
    'automotive-square': {
        'name': 'Automotive Square (Kamptee Road)',
        'parkings': [
            {'id': 'A', 'name': 'Kamptee Road Terminal Plaza', 'totalSlots': 60, 'availableSlots': 18, 'distance': 150},
            {'id': 'B', 'name': 'Automotive Junction Bay', 'totalSlots': 50, 'availableSlots': 32, 'distance': 260},
            {'id': 'C', 'name': 'Uppalwadi Commuter Deck', 'totalSlots': 45, 'availableSlots': 30, 'distance': 430}
        ]
    },
    'dharampeth-college': {
        'name': 'Dharampeth College (Shankar Nagar)',
        'parkings': [
            {'id': 'A', 'name': 'WHC Road North Bay', 'totalSlots': 35, 'availableSlots': 8, 'distance': 130},
            {'id': 'B', 'name': 'Shankar Nagar Square Lot', 'totalSlots': 45, 'availableSlots': 25, 'distance': 240},
            {'id': 'C', 'name': 'Laxmi Bhuvan Deck', 'totalSlots': 50, 'availableSlots': 34, 'distance': 390}
        ]
    },
    'subhash-nagar': {
        'name': 'Subhash Nagar (Ambazari / VNIT)',
        'parkings': [
            {'id': 'A', 'name': 'Ambazari Garden Bay', 'totalSlots': 40, 'availableSlots': 11, 'distance': 140},
            {'id': 'B', 'name': 'VNIT Gate 2 Parking', 'totalSlots': 50, 'availableSlots': 29, 'distance': 250},
            {'id': 'C', 'name': 'Subhash Nagar Concourse', 'totalSlots': 45, 'availableSlots': 33, 'distance': 400}
        ]
    },
    'lokmanya-nagar': {
        'name': 'Lokmanya Nagar (Hingna MIDC)',
        'parkings': [
            {'id': 'A', 'name': 'Hingna MIDC Commuter Bay', 'totalSlots': 65, 'availableSlots': 20, 'distance': 120},
            {'id': 'B', 'name': 'IC Square Parking Lot', 'totalSlots': 50, 'availableSlots': 33, 'distance': 240},
            {'id': 'C', 'name': 'Yashwant Nagar Concourse', 'totalSlots': 45, 'availableSlots': 30, 'distance': 390}
        ]
    },
    'prajapati-nagar': {
        'name': 'Prajapati Nagar (Pardi / Bhandara Rd)',
        'parkings': [
            {'id': 'A', 'name': 'Bhandara Road Terminal Bay', 'totalSlots': 55, 'availableSlots': 15, 'distance': 150},
            {'id': 'B', 'name': 'Pardi Flyover Parking', 'totalSlots': 50, 'availableSlots': 28, 'distance': 270},
            {'id': 'C', 'name': 'Kapsi Road Commuter Deck', 'totalSlots': 40, 'availableSlots': 26, 'distance': 410}
        ]
    }
}

booking_counter = 1001
active_bookings = []

# ================= C++ CORE ALGORITHMS =================

def predict_demand(hour):
    if 6 <= hour < 8:
        return 'Low'
    elif 8 <= hour < 10:
        return 'High'
    elif 10 <= hour < 16:
        return 'Medium'
    elif 16 <= hour < 19:
        return 'High'
    else:
        return 'Low'

def calculate_demand_score(demand):
    if demand == 'Low':
        return 100.0
    elif demand == 'Medium':
        return 60.0
    else:
        return 30.0

def calculate_availability(parking):
    if parking['totalSlots'] == 0:
        return 0.0
    return (parking['availableSlots'] / parking['totalSlots']) * 100.0

def calculate_distance_score(parking, closest, farthest):
    if farthest == closest:
        return 100.0
    return ((farthest - parking['distance']) / (farthest - closest)) * 100.0

def compute_smart_scores(parkings, current_hour):
    demand = predict_demand(current_hour)
    demand_score = calculate_demand_score(demand)

    distances = [p['distance'] for p in parkings]
    closest = min(distances)
    farthest = max(distances)

    scored = []
    highest_score = -1.0
    recommended_id = None

    for p in parkings:
        avail = calculate_availability(p)
        dist_score = calculate_distance_score(p, closest, farthest)
        smart_score = (avail * 0.40) + (dist_score * 0.30) + (demand_score * 0.30)

        item = dict(p)
        item['availabilityScore'] = round(avail, 1)
        item['distanceScore'] = round(dist_score, 1)
        item['demand'] = demand
        item['demandScore'] = demand_score
        item['smartScore'] = round(smart_score, 1)

        if smart_score > highest_score:
            highest_score = smart_score
            recommended_id = p['id']

        scored.append(item)

    for item in scored:
        item['isRecommended'] = (item['id'] == recommended_id)

    return scored

# ================= REQUEST HANDLER =================

class ParkingRequestHandler(http.server.BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        response_bytes = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        # 1. GET /api/stations
        if parsed.path == '/api/stations':
            stations = [{'id': k, 'name': v['name'], 'totalParkings': len(v['parkings'])} for k, v in station_data.items()]
            return self.send_json(200, {'stations': stations})

        # 2. GET /api/parking
        if parsed.path == '/api/parking':
            station_id = params.get('station', ['jaiprakash-nagar'])[0]
            hour_str = params.get('hour', [str(datetime.now().hour)])[0]
            try:
                current_hour = int(hour_str)
            except ValueError:
                current_hour = datetime.now().hour

            station = station_data.get(station_id)
            if not station:
                return self.send_json(404, {'error': 'Station not found'})

            computed = compute_smart_scores(station['parkings'], current_hour)
            return self.send_json(200, {
                'stationId': station_id,
                'stationName': station['name'],
                'currentHour': current_hour,
                'demand': predict_demand(current_hour),
                'parkings': computed
            })

        # 3. GET /api/bookings
        if parsed.path == '/api/bookings':
            now_ms = time.time() * 1000
            for b in active_bookings:
                if b['status'] == 'ACTIVE' and b['expiresAtTimestamp'] <= now_ms:
                    b['status'] = 'EXPIRED'
                    station = station_data.get(b['stationId'])
                    if station:
                        for p in station['parkings']:
                            if p['id'] == b['parkingId']:
                                p['availableSlots'] = min(p['totalSlots'], p['availableSlots'] + 1)
            return self.send_json(200, {'bookings': active_bookings})

        # Serve static frontend files cleanly
        rel_path = parsed.path.lstrip('/')
        if not rel_path or rel_path == '/':
            rel_path = 'index.html'

        # Security check & path normalization
        safe_rel_path = os.path.normpath(rel_path).lstrip(os.path.sep)
        file_path = os.path.join(FRONTEND_DIR, safe_rel_path)

        if os.path.isfile(file_path):
            content_type, _ = mimetypes.guess_type(file_path)
            if file_path.endswith('.js'):
                content_type = 'text/javascript'
            elif file_path.endswith('.css'):
                content_type = 'text/css'
            elif not content_type:
                content_type = 'application/octet-stream'

            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_json(500, {'error': f'File read error: {str(e)}'})
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'404 Not Found')

    def do_POST(self):
        global booking_counter
        parsed = urllib.parse.urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length > 0 else '{}'
        try:
            data = json.loads(body)
        except Exception:
            return self.send_json(400, {'error': 'Invalid JSON'})

        # POST /api/reserve
        if parsed.path == '/api/reserve':
            station_id = data.get('stationId')
            parking_id = data.get('parkingId')
            slot_number = data.get('slotNumber')

            station = station_data.get(station_id)
            if not station:
                return self.send_json(404, {'error': 'Station not found'})

            parking = next((p for p in station['parkings'] if p['id'] == parking_id), None)
            if not parking:
                return self.send_json(404, {'error': 'Parking not found'})

            if parking['availableSlots'] <= 0:
                return self.send_json(400, {'error': 'No slots available'})

            parking['availableSlots'] -= 1
            booking_id = f"MP{booking_counter}"
            booking_counter += 1

            assigned_slot = slot_number or f"{parking['id']}-{parking['totalSlots'] - parking['availableSlots']:02d}"
            exp_ts = (time.time() + 600) * 1000  # 10 minutes hold

            booking = {
                'bookingId': booking_id,
                'stationId': station_id,
                'stationName': station['name'],
                'parkingId': parking['id'],
                'parkingName': parking['name'],
                'distance': parking['distance'],
                'slotNumber': assigned_slot,
                'reservedAt': datetime.now().isoformat(),
                'expiresAtTimestamp': exp_ts,
                'status': 'ACTIVE'
            }
            active_bookings.append(booking)
            return self.send_json(201, {'success': True, 'booking': booking, 'remainingSlots': parking['availableSlots']})

        # POST /api/cancel
        if parsed.path == '/api/cancel':
            booking_id = data.get('bookingId')
            booking = next((b for b in active_bookings if b['bookingId'] == booking_id), None)
            if not booking:
                return self.send_json(404, {'error': 'Booking not found'})

            if booking['status'] == 'ACTIVE':
                booking['status'] = 'CANCELLED'
                station = station_data.get(booking['stationId'])
                if station:
                    for p in station['parkings']:
                        if p['id'] == booking['parkingId']:
                            p['availableSlots'] = min(p['totalSlots'], p['availableSlots'] + 1)

            return self.send_json(200, {'success': True, 'message': 'Reservation cancelled'})

        return self.send_json(404, {'error': 'Endpoint not found'})

    def log_message(self, format, *args):
        # Clean custom console logging
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    ports_to_try = [5000, 8000, 8080, 3000]

    for port in ports_to_try:
        try:
            httpd = socketserver.TCPServer(("", port), ParkingRequestHandler)
            print("\n=======================================================")
            print(f"🚀 MetroPark Smart Parking Python Server is Running!")
            print(f"🌐 Open in browser (IPv4): http://127.0.0.1:{port}")
            print(f"🌐 Or in localhost:       http://localhost:{port}")
            print(f"📡 API Endpoint:           http://127.0.0.1:{port}/api/parking")
            print("=======================================================\n")
            print("Press Ctrl+C to stop the server.\n")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer shutting down...")
                httpd.server_close()
            return
        except OSError as e:
            if "address already in use" in str(e).lower() or "10048" in str(e):
                print(f"⚠️ Port {port} is in use, trying next port...")
                continue
            else:
                print(f"❌ Error starting server on port {port}: {e}")
                return

if __name__ == '__main__':
    start_server()
