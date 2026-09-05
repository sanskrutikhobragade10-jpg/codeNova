// =========================================================
// MetroPark - Dynamic Smart Parking Engine & API Connector
// Implements core algorithm from parking.cpp + Dual Mode Sync
// =========================================================

// Global State
const state = {
    backendConnected: false,
    apiBase: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? window.location.origin
        : 'http://localhost:3000',
    currentStationId: 'sitabuldi',
    currentHour: 9,
    stations: {
        'sitabuldi': {
            name: 'Sitabuldi Interchange',
            line: 'Interchange Junction (Orange ↔ Aqua)',
            parkings: [
                { id: 'A', name: 'Munje Square Concourse', totalSlots: 50, availableSlots: 14, distance: 120 },
                { id: 'B', name: 'Tekdi Road Parking Bay', totalSlots: 60, availableSlots: 35, distance: 230 },
                { id: 'C', name: 'Buty Plaza South Lot', totalSlots: 45, availableSlots: 28, distance: 380 }
            ]
        },
        'zero-mile': {
            name: 'Zero Mile Freedom Park',
            line: 'Orange Line / Civil Lines',
            parkings: [
                { id: 'A', name: 'Freedom Park North Bay', totalSlots: 40, availableSlots: 10, distance: 110 },
                { id: 'B', name: 'Civil Lines Concourse', totalSlots: 50, availableSlots: 26, distance: 220 },
                { id: 'C', name: 'RBI Square East Deck', totalSlots: 45, availableSlots: 32, distance: 390 }
            ]
        },
        'jaiprakash-nagar': {
            name: 'Jaiprakash Nagar (Wardha Road)',
            line: 'Orange Line',
            parkings: [
                { id: 'A', name: 'Parking A (West Bay)', totalSlots: 20, availableSlots: 5, distance: 150 },
                { id: 'B', name: 'Parking B (Main Concourse)', totalSlots: 30, availableSlots: 18, distance: 250 },
                { id: 'C', name: 'Parking C (Khamla Road Lot)', totalSlots: 40, availableSlots: 25, distance: 400 }
            ]
        },
        'airport': {
            name: 'Airport Metro Station (Sonegaon)',
            line: 'Orange Line',
            parkings: [
                { id: 'A', name: 'Terminal 1 Commuter Lot', totalSlots: 50, availableSlots: 12, distance: 130 },
                { id: 'B', name: 'Sonegaon North Bay', totalSlots: 40, availableSlots: 28, distance: 240 },
                { id: 'C', name: 'Aerodrome South Deck', totalSlots: 60, availableSlots: 42, distance: 410 }
            ]
        },
        'congress-nagar': {
            name: 'Congress Nagar (Ajni)',
            line: 'Orange Line',
            parkings: [
                { id: 'A', name: 'Platform 1 Ajni Link', totalSlots: 30, availableSlots: 6, distance: 140 },
                { id: 'B', name: 'Dhantoli Garden Parking', totalSlots: 40, availableSlots: 22, distance: 260 },
                { id: 'C', name: 'Congress Nagar East Bay', totalSlots: 45, availableSlots: 31, distance: 420 }
            ]
        },
        'rahate-colony': {
            name: 'Rahate Colony (NEERI / Wardha Rd)',
            line: 'Orange Line',
            parkings: [
                { id: 'A', name: 'NEERI Gate Concourse', totalSlots: 35, availableSlots: 9, distance: 160 },
                { id: 'B', name: 'Wardha Road West Bay', totalSlots: 45, availableSlots: 27, distance: 270 },
                { id: 'C', name: 'Medical Square South Lot', totalSlots: 50, availableSlots: 36, distance: 440 }
            ]
        },
        'kasturchand-park': {
            name: 'Kasturchand Park (Kingsway)',
            line: 'Orange Line',
            parkings: [
                { id: 'A', name: 'KP Ground North Lot', totalSlots: 55, availableSlots: 16, distance: 140 },
                { id: 'B', name: 'Kingsway Station Parking', totalSlots: 50, availableSlots: 31, distance: 250 },
                { id: 'C', name: 'Mohota Science Concourse', totalSlots: 40, availableSlots: 26, distance: 390 }
            ]
        },
        'automotive-square': {
            name: 'Automotive Square (Kamptee Road)',
            line: 'Orange Line North Terminal',
            parkings: [
                { id: 'A', name: 'Kamptee Road Terminal Plaza', totalSlots: 60, availableSlots: 18, distance: 150 },
                { id: 'B', name: 'Automotive Junction Bay', totalSlots: 50, availableSlots: 32, distance: 260 },
                { id: 'C', name: 'Uppalwadi Commuter Deck', totalSlots: 45, availableSlots: 30, distance: 430 }
            ]
        },
        'dharampeth-college': {
            name: 'Dharampeth College (Shankar Nagar)',
            line: 'Aqua Line',
            parkings: [
                { id: 'A', name: 'WHC Road North Bay', totalSlots: 35, availableSlots: 8, distance: 130 },
                { id: 'B', name: 'Shankar Nagar Square Lot', totalSlots: 45, availableSlots: 25, distance: 240 },
                { id: 'C', name: 'Laxmi Bhuvan Deck', totalSlots: 50, availableSlots: 34, distance: 390 }
            ]
        },
        'subhash-nagar': {
            name: 'Subhash Nagar (Ambazari / VNIT)',
            line: 'Aqua Line',
            parkings: [
                { id: 'A', name: 'Ambazari Garden Bay', totalSlots: 40, availableSlots: 11, distance: 140 },
                { id: 'B', name: 'VNIT Gate 2 Parking', totalSlots: 50, availableSlots: 29, distance: 250 },
                { id: 'C', name: 'Subhash Nagar Concourse', totalSlots: 45, availableSlots: 33, distance: 400 }
            ]
        },
        'lokmanya-nagar': {
            name: 'Lokmanya Nagar (Hingna MIDC)',
            line: 'Aqua Line West Terminal',
            parkings: [
                { id: 'A', name: 'Hingna MIDC Commuter Bay', totalSlots: 65, availableSlots: 20, distance: 120 },
                { id: 'B', name: 'IC Square Parking Lot', totalSlots: 50, availableSlots: 33, distance: 240 },
                { id: 'C', name: 'Yashwant Nagar Concourse', totalSlots: 45, availableSlots: 30, distance: 390 }
            ]
        },
        'prajapati-nagar': {
            name: 'Prajapati Nagar (Pardi / Bhandara Rd)',
            line: 'Aqua Line East Terminal',
            parkings: [
                { id: 'A', name: 'Bhandara Road Terminal Bay', totalSlots: 55, availableSlots: 15, distance: 150 },
                { id: 'B', name: 'Pardi Flyover Parking', totalSlots: 50, availableSlots: 28, distance: 270 },
                { id: 'C', name: 'Kapsi Road Commuter Deck', totalSlots: 40, availableSlots: 26, distance: 410 }
            ]
        }
    },
    activeBookings: JSON.parse(localStorage.getItem('metropark_bookings') || '[]'),
    bookingCounter: parseInt(localStorage.getItem('metropark_counter') || '1001', 10),
    selectedParkingForRes: null,
    selectedSlot: null,
    activeCountdownInterval: null
};

// ================= CORE C++ ALGORITHMS IN JS =================

// 1. Demand Prediction (Matches C++ predictDemand)
function predictDemand(hour) {
    if (hour >= 6 && hour < 8) return 'Low';
    if (hour >= 8 && hour < 10) return 'High';
    if (hour >= 10 && hour < 16) return 'Medium';
    if (hour >= 16 && hour < 19) return 'High';
    return 'Low';
}

// 2. Demand Score (Matches C++ calculateDemandScore)
function calculateDemandScore(demand) {
    if (demand === 'Low') return 100;
    if (demand === 'Medium') return 60;
    return 30; // High
}

// 3. Availability Score (Matches C++ calculateAvailability)
function calculateAvailability(parking) {
    if (!parking.totalSlots) return 0;
    return (parking.availableSlots / parking.totalSlots) * 100;
}

// 4. Distance Score (Matches C++ calculateDistanceScore)
function calculateDistanceScore(parking, closestDistance, farthestDistance) {
    if (farthestDistance === closestDistance) return 100;
    return ((farthestDistance - parking.distance) / (farthestDistance - closestDistance)) * 100;
}

// 5. Smart Score Calculation (Matches C++ smartScore)
function calculateSmartScores(parkings, currentHour) {
    const demand = predictDemand(currentHour);
    const demandScore = calculateDemandScore(demand);

    const distances = parkings.map(p => p.distance);
    const closest = Math.min(...distances);
    const farthest = Math.max(...distances);

    const scored = parkings.map(parking => {
        const availScore = calculateAvailability(parking);
        const distScore = calculateDistanceScore(parking, closest, farthest);
        
        // Smart Score: 40% Availability + 30% Distance + 30% Demand
        const smartScore = (availScore * 0.40) + (distScore * 0.30) + (demandScore * 0.30);

        return {
            ...parking,
            availabilityScore: Math.round(availScore * 10) / 10,
            distanceScore: Math.round(distScore * 10) / 10,
            demand,
            demandScore,
            smartScore: Math.round(smartScore * 10) / 10
        };
    });

    // Find highest smart score
    let highestScore = -1;
    let recommendedId = null;

    scored.forEach(p => {
        if (p.smartScore > highestScore) {
            highestScore = p.smartScore;
            recommendedId = p.id;
        }
    });

    return scored.map(p => ({
        ...p,
        isRecommended: p.id === recommendedId
    }));
}

// ================= DOM ELEMENTS =================
const elements = {
    navLogo: document.getElementById('navLogo'),
    backendStatus: document.getElementById('backendStatus'),
    myBookingNavBtn: document.getElementById('myBookingNavBtn'),
    bookingCountBadge: document.getElementById('bookingCountBadge'),
    homeSection: document.getElementById('homeSection'),
    parkingResults: document.getElementById('parkingResults'),
    reservationSection: document.getElementById('reservationSection'),
    confirmationSection: document.getElementById('confirmationSection'),
    bookingModal: document.getElementById('bookingModal'),
    modalBookingsList: document.getElementById('modalBookingsList'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    stationSelect: document.getElementById('station'),
    timePicker: document.getElementById('timePicker'),
    heroDemandBadge: document.getElementById('heroDemandBadge'),
    findParkingBtn: document.getElementById('findParkingBtn'),
    backBtn: document.getElementById('backBtn'),
    reservationBack: document.getElementById('reservationBack'),
    selectedStationText: document.getElementById('selectedStation'),
    parkingGrid: document.getElementById('parkingGrid'),
    resultsSubtext: document.getElementById('resultsSubtext'),
    // Hero preview
    previewStationTitle: document.getElementById('previewStationTitle'),
    previewParkingName: document.getElementById('previewParkingName'),
    previewParkingDist: document.getElementById('previewParkingDist'),
    previewSlots: document.getElementById('previewSlots'),
    previewAvailScore: document.getElementById('previewAvailScore'),
    previewDistScore: document.getElementById('previewDistScore'),
    previewSmartScore: document.getElementById('previewSmartScore'),
    previewRecommendedTag: document.getElementById('previewRecommendedTag'),
    // Reservation
    resParkingName: document.getElementById('resParkingName'),
    resStationSubtitle: document.getElementById('resStationSubtitle'),
    resAvailableSlots: document.getElementById('resAvailableSlots'),
    resDistance: document.getElementById('resDistance'),
    resDemand: document.getElementById('resDemand'),
    resSmartScore: document.getElementById('resSmartScore'),
    slotSelect: document.getElementById('slotSelect'),
    visualSlotGrid: document.getElementById('visualSlotGrid'),
    confirmBookingBtn: document.getElementById('confirmBooking'),
    // Confirmation
    confirmedBookingId: document.getElementById('confirmedBookingId'),
    confirmedStation: document.getElementById('confirmedStation'),
    confirmedParking: document.getElementById('confirmedParking'),
    confirmedSlot: document.getElementById('confirmedSlot'),
    confirmedDistance: document.getElementById('confirmedDistance'),
    holdCountdown: document.getElementById('holdCountdown'),
    timerFill: document.getElementById('timerFill'),
    homeBtn: document.getElementById('homeBtn'),
    viewBookingsBtn: document.getElementById('viewBookingsBtn'),
    toast: document.getElementById('toast')
};

// ================= BACKEND CONNECTION CHECK =================
async function checkBackendConnection() {
    const candidateBases = [
        window.location.origin,
        'http://localhost:5000',
        'http://localhost:3000',
        'http://localhost:8000'
    ];

    for (const base of candidateBases) {
        if (!base || base.startsWith('file://')) continue;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);
            const res = await fetch(`${base}/api/stations`, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                state.apiBase = base;
                state.backendConnected = true;
                elements.backendStatus.className = 'status-pill connected';
                elements.backendStatus.innerHTML = `<span class="status-dot"></span><span class="status-text">🟢 API Connected (${base.replace('http://', '')})</span>`;
                return true;
            }
        } catch (e) {
            // continue checking next port
        }
    }

    state.backendConnected = false;
    elements.backendStatus.className = 'status-pill local';
    elements.backendStatus.innerHTML = '<span class="status-dot"></span><span class="status-text">⚡ Local Engine Active</span>';
    return false;
}

// ================= SHOW TOAST =================
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3500);
}

// ================= UI NAVIGATION =================
function showView(viewName) {
    elements.homeSection.style.display = viewName === 'home' ? 'flex' : 'none';
    elements.parkingResults.style.display = viewName === 'results' ? 'block' : 'none';
    elements.reservationSection.style.display = viewName === 'reservation' ? 'block' : 'none';
    elements.confirmationSection.style.display = viewName === 'confirmation' ? 'flex' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= HERO PREVIEW UPDATE =================
function updateHeroPreview() {
    const stationId = elements.stationSelect.value;
    state.currentStationId = stationId;

    const timeVal = elements.timePicker.value;
    state.currentHour = timeVal === 'current' ? new Date().getHours() : parseInt(timeVal, 10);

    const demand = predictDemand(state.currentHour);
    elements.heroDemandBadge.textContent = `${demand.toUpperCase()} DEMAND`;
    elements.heroDemandBadge.className = `demand-pill ${demand.toLowerCase()}`;

    const station = state.stations[stationId];
    if (!station) return;

    elements.previewStationTitle.textContent = station.name;

    const scoredParkings = calculateSmartScores(station.parkings, state.currentHour);
    const topParking = scoredParkings.find(p => p.isRecommended) || scoredParkings[0];

    if (topParking) {
        elements.previewParkingName.textContent = topParking.name;
        elements.previewParkingDist.textContent = `${topParking.distance} m from station`;
        elements.previewSlots.textContent = topParking.availableSlots;
        elements.previewAvailScore.textContent = `${topParking.availabilityScore}%`;
        elements.previewDistScore.textContent = `${topParking.distance}m`;
        elements.previewSmartScore.textContent = topParking.smartScore.toFixed(1);
    }
}

// ================= RENDER PARKING CARDS =================
async function renderParkingResults() {
    const stationId = state.currentStationId;
    const station = state.stations[stationId];
    if (!station) return;

    elements.selectedStationText.textContent = station.name;
    const demand = predictDemand(state.currentHour);
    elements.resultsSubtext.innerHTML = `Forecast at <strong>${state.currentHour}:00</strong>: <span class="demand-pill ${demand.toLowerCase()}">${demand} Demand</span> • Smart scoring weights: Availability (40%), Distance (30%), Demand (30%).`;

    let parkingsToRender = [];

    // Attempt to fetch from backend if connected
    if (state.backendConnected) {
        try {
            const res = await fetch(`${state.apiBase}/api/parking?station=${stationId}&hour=${state.currentHour}`);
            if (res.ok) {
                const data = await res.json();
                parkingsToRender = data.parkings;
            }
        } catch (e) {
            console.warn('API error, falling back to local calculation');
        }
    }

    if (parkingsToRender.length === 0) {
        parkingsToRender = calculateSmartScores(station.parkings, state.currentHour);
    }

    elements.parkingGrid.innerHTML = '';

    parkingsToRender.forEach(parking => {
        const card = document.createElement('div');
        card.className = `parking-card ${parking.isRecommended ? 'recommended-card' : ''}`;

        const availClass = parking.availabilityScore >= 50 ? 'high-avail' : (parking.availabilityScore >= 25 ? 'med-avail' : 'low-avail');
        const demandClass = parking.demand.toLowerCase();

        let reasonsHTML = '';
        if (parking.isRecommended) {
            reasonsHTML = `
                <div class="recommendation-reasons">
                    <p>✓ Highest Smart Score (${parking.smartScore.toFixed(1)}/100)</p>
                    <p>✓ ${parking.availableSlots} slots available (${parking.availabilityScore}%)</p>
                    <p>✓ Convenient walking distance (${parking.distance}m)</p>
                </div>
            `;
        }

        card.innerHTML = `
            ${parking.isRecommended ? '<div class="recommended-label">⭐ RECOMMENDED FOR YOU</div>' : ''}
            
            <div class="card-top">
                <div>
                    <h3>${parking.name}</h3>
                    <p>📍 ${parking.distance} m from station</p>
                </div>
                <span class="demand ${demandClass}">${parking.demand.toUpperCase()} DEMAND</span>
            </div>

            <div class="availability">
                <div class="availability-text">
                    <strong>${parking.availableSlots}</strong>
                    <span>/ ${parking.totalSlots} slots available</span>
                </div>
                <div class="progress">
                    <div class="progress-fill ${availClass}" style="width: ${parking.availabilityScore}%;"></div>
                </div>
            </div>

            <div class="card-metrics">
                <div class="metric-item">
                    <small>Availability</small>
                    <strong>${parking.availabilityScore}%</strong>
                </div>
                <div class="metric-item">
                    <small>Distance</small>
                    <strong>${parking.distance} m</strong>
                </div>
                <div class="metric-item">
                    <small>Smart Score</small>
                    <strong class="accent-text">${parking.smartScore.toFixed(1)}</strong>
                </div>
            </div>

            ${reasonsHTML}

            <button class="card-action-btn ${parking.isRecommended ? 'reserve-btn' : 'view-btn'}" data-id="${parking.id}">
                ${parking.availableSlots > 0 ? (parking.isRecommended ? 'RESERVE SLOT →' : 'SELECT PARKING →') : 'FULL / NO SLOTS'}
            </button>
        `;

        const actionBtn = card.querySelector('.card-action-btn');
        if (parking.availableSlots <= 0) {
            actionBtn.disabled = true;
            actionBtn.style.opacity = '0.5';
            actionBtn.style.cursor = 'not-allowed';
        } else {
            actionBtn.addEventListener('click', () => {
                openReservationView(parking);
            });
        }

        elements.parkingGrid.appendChild(card);
    });

    showView('results');
}

// ================= RESERVATION VIEW =================
function openReservationView(parking) {
    state.selectedParkingForRes = parking;
    state.selectedSlot = null;

    const station = state.stations[state.currentStationId];
    elements.resParkingName.textContent = parking.name;
    elements.resStationSubtitle.textContent = `📍 ${parking.distance} m from ${station.name}`;
    elements.resAvailableSlots.textContent = parking.availableSlots;
    elements.resDistance.textContent = `${parking.distance} m`;
    elements.resDemand.textContent = parking.demand;
    elements.resSmartScore.textContent = parking.smartScore ? parking.smartScore.toFixed(1) : '--';

    // Populate Slots
    elements.slotSelect.innerHTML = '<option value="">Choose a slot...</option>';
    elements.visualSlotGrid.innerHTML = '';

    const totalSlots = parking.totalSlots;
    const occupiedCount = totalSlots - parking.availableSlots;

    for (let i = 1; i <= totalSlots; i++) {
        const slotCode = `${parking.id}-${String(i).padStart(2, '0')}`;
        // Mark first occupiedCount slots as occupied, rest as available
        const isOccupied = i <= occupiedCount;

        // Dropdown Option
        const opt = document.createElement('option');
        opt.value = slotCode;
        opt.textContent = `Slot ${slotCode} ${isOccupied ? '(Occupied)' : '(Available)'}`;
        if (isOccupied) opt.disabled = true;
        elements.slotSelect.appendChild(opt);

        // Visual Slot Button
        const slotBtn = document.createElement('button');
        slotBtn.type = 'button';
        slotBtn.className = `slot-btn ${isOccupied ? 'occupied' : 'available'}`;
        slotBtn.textContent = slotCode;
        slotBtn.disabled = isOccupied;

        if (!isOccupied) {
            slotBtn.addEventListener('click', () => {
                document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                slotBtn.classList.add('selected');
                elements.slotSelect.value = slotCode;
                state.selectedSlot = slotCode;
            });
        }

        elements.visualSlotGrid.appendChild(slotBtn);
    }

    // Default select first available slot
    const firstAvail = elements.slotSelect.querySelector('option:not([disabled]):not([value=""])');
    if (firstAvail) {
        elements.slotSelect.value = firstAvail.value;
        state.selectedSlot = firstAvail.value;
        const matchingBtn = Array.from(elements.visualSlotGrid.children).find(b => b.textContent === firstAvail.value);
        if (matchingBtn) matchingBtn.classList.add('selected');
    }

    elements.slotSelect.onchange = (e) => {
        state.selectedSlot = e.target.value;
        document.querySelectorAll('.slot-btn').forEach(b => {
            b.classList.toggle('selected', b.textContent === e.target.value);
        });
    };

    showView('reservation');
}

// ================= CONFIRM RESERVATION =================
async function confirmReservation() {
    const slotNumber = state.selectedSlot || elements.slotSelect.value;
    if (!slotNumber) {
        alert('Please select a parking slot first.');
        return;
    }

    const station = state.stations[state.currentStationId];
    const parking = state.selectedParkingForRes;

    if (!parking || parking.availableSlots <= 0) {
        alert(`Sorry! No slots available at ${parking ? parking.name : 'this location'}.`);
        return;
    }

    let booking = null;

    // Try backend API first
    if (state.backendConnected) {
        try {
            const res = await fetch(`${state.apiBase}/api/reserve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stationId: state.currentStationId,
                    parkingId: parking.id,
                    slotNumber: slotNumber
                })
            });
            if (res.ok) {
                const data = await res.json();
                booking = data.booking;
                if (data.remainingSlots !== undefined) {
                    parking.availableSlots = data.remainingSlots;
                }
            }
        } catch (e) {
            console.warn('Backend reserve failed, proceeding locally');
        }
    }

    // Local reservation engine fallback (Matches C++ parkingB.availableSlots--)
    if (!booking) {
        parking.availableSlots = Math.max(0, parking.availableSlots - 1);

        const bookingId = `MP${state.bookingCounter++}`;
        localStorage.setItem('metropark_counter', state.bookingCounter.toString());

        const expTime = Date.now() + (10 * 60 * 1000); // 10 minutes hold
        booking = {
            bookingId,
            stationId: state.currentStationId,
            stationName: station.name,
            parkingId: parking.id,
            parkingName: parking.name,
            distance: parking.distance,
            slotNumber: slotNumber,
            reservedAt: new Date().toISOString(),
            expiresAtTimestamp: expTime,
            status: 'ACTIVE'
        };
    }

    // Save booking to state & localStorage
    const existingIndex = state.activeBookings.findIndex(b => b.bookingId === booking.bookingId);
    if (existingIndex >= 0) {
        state.activeBookings[existingIndex] = booking;
    } else {
        state.activeBookings.unshift(booking);
    }
    localStorage.setItem('metropark_bookings', JSON.stringify(state.activeBookings));

    handleReservationSuccess(booking);
}

// ================= RESERVATION SUCCESS HANDLER =================
function handleReservationSuccess(booking) {
    elements.confirmedBookingId.textContent = booking.bookingId;
    elements.confirmedStation.textContent = booking.stationName;
    elements.confirmedParking.textContent = booking.parkingName;
    elements.confirmedSlot.textContent = booking.slotNumber;
    elements.confirmedDistance.textContent = `${booking.distance} m`;

    updateBookingCountBadge();
    startHoldCountdown(booking.expiresAtTimestamp, booking.bookingId);
    showView('confirmation');
    showToast(`🎉 Slot ${booking.slotNumber} reserved! Booking ID: ${booking.bookingId}`);
}

// ================= 10-MINUTE HOLD COUNTDOWN & AUTO-EXPIRATION =================
function startHoldCountdown(expiresAtTimestamp, bookingId) {
    if (state.activeCountdownInterval) {
        clearInterval(state.activeCountdownInterval);
    }

    const totalHoldMs = 10 * 60 * 1000;

    function update() {
        const remainingMs = expiresAtTimestamp - Date.now();

        if (remainingMs <= 0) {
            clearInterval(state.activeCountdownInterval);
            elements.holdCountdown.textContent = 'EXPIRED';
            elements.timerFill.style.width = '0%';
            expireBooking(bookingId);
            return;
        }

        const mins = Math.floor(remainingMs / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);
        elements.holdCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const pct = Math.max(0, Math.min(100, (remainingMs / totalHoldMs) * 100));
        elements.timerFill.style.width = `${pct}%`;
    }

    update();
    state.activeCountdownInterval = setInterval(update, 1000);
}

// ================= AUTO EXPIRE / RELEASE (Matches C++ expireReservation) =================
function expireBooking(bookingId) {
    const booking = state.activeBookings.find(b => b.bookingId === bookingId);
    if (booking && booking.status === 'ACTIVE') {
        booking.status = 'EXPIRED';
        localStorage.setItem('metropark_bookings', JSON.stringify(state.activeBookings));

        // Restore slot in local dataset
        const station = state.stations[booking.stationId];
        if (station) {
            const parking = station.parkings.find(p => p.id === booking.parkingId);
            if (parking) {
                parking.availableSlots = Math.min(parking.totalSlots, parking.availableSlots + 1);
            }
        }

        showToast(`⏰ Hold expired for ${booking.slotNumber}. Slot released at ${booking.parkingName}.`);
        updateBookingCountBadge();
        renderMyBookingsModal();
    }
}

// ================= CANCEL RESERVATION =================
async function cancelBooking(bookingId) {
    if (state.backendConnected) {
        try {
            await fetch(`${state.apiBase}/api/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId })
            });
        } catch (e) {
            console.warn('Backend cancel failed, updating locally');
        }
    }

    const booking = state.activeBookings.find(b => b.bookingId === bookingId);
    if (booking && booking.status === 'ACTIVE') {
        booking.status = 'CANCELLED';
        localStorage.setItem('metropark_bookings', JSON.stringify(state.activeBookings));

        const station = state.stations[booking.stationId];
        if (station) {
            const parking = station.parkings.find(p => p.id === booking.parkingId);
            if (parking) {
                parking.availableSlots = Math.min(parking.totalSlots, parking.availableSlots + 1);
            }
        }

        showToast(`✓ Reservation ${bookingId} cancelled. Slot released!`);
        updateBookingCountBadge();
        renderMyBookingsModal();
    }
}

// ================= SYNC BOOKINGS (DUAL MODE: LOCALSTORAGE + BACKEND API) =================
async function syncBookings() {
    const now = Date.now();
    let updated = false;

    // 1. Auto-expire past bookings in local state
    state.activeBookings.forEach(b => {
        if (b.status === 'ACTIVE' && b.expiresAtTimestamp && b.expiresAtTimestamp <= now) {
            b.status = 'EXPIRED';
            updated = true;
        }
    });

    // 2. Fetch from backend if connected
    if (state.backendConnected) {
        try {
            const res = await fetch(`${state.apiBase}/api/bookings`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.bookings)) {
                    const bookingMap = new Map();
                    // Load local bookings
                    state.activeBookings.forEach(b => {
                        if (b && b.bookingId) bookingMap.set(b.bookingId, b);
                    });
                    // Merge/overwrite with backend bookings
                    data.bookings.forEach(b => {
                        if (b && b.bookingId) {
                            if (b.status === 'ACTIVE' && b.expiresAtTimestamp && b.expiresAtTimestamp <= now) {
                                b.status = 'EXPIRED';
                            }
                            bookingMap.set(b.bookingId, b);
                        }
                    });

                    state.activeBookings = Array.from(bookingMap.values()).sort((a, b) => {
                        const tsA = a.expiresAtTimestamp || 0;
                        const tsB = b.expiresAtTimestamp || 0;
                        return tsB - tsA;
                    });
                    updated = true;
                }
            }
        } catch (e) {
            console.warn('Backend booking sync warning:', e);
        }
    }

    if (updated) {
        localStorage.setItem('metropark_bookings', JSON.stringify(state.activeBookings));
    }
    updateBookingCountBadge();
}

// ================= "MY BOOKINGS" MODAL =================
function updateBookingCountBadge() {
    const now = Date.now();
    const activeCount = state.activeBookings.filter(b => b.status === 'ACTIVE' && (!b.expiresAtTimestamp || b.expiresAtTimestamp > now)).length;
    if (activeCount > 0) {
        elements.bookingCountBadge.style.display = 'inline-block';
        elements.bookingCountBadge.textContent = activeCount;
    } else {
        elements.bookingCountBadge.style.display = 'none';
    }
}

// ================= OPEN BOOKING DETAILS =================
function openBookingDetails(booking) {
    closeMyBookingsModal();

    elements.confirmedBookingId.textContent = booking.bookingId;
    elements.confirmedStation.textContent = booking.stationName;
    elements.confirmedParking.textContent = booking.parkingName;
    elements.confirmedSlot.textContent = booking.slotNumber;
    elements.confirmedDistance.textContent = `${booking.distance} m`;

    const isStillActive = booking.status === 'ACTIVE' && (!booking.expiresAtTimestamp || booking.expiresAtTimestamp > Date.now());
    if (isStillActive) {
        startHoldCountdown(booking.expiresAtTimestamp, booking.bookingId);
    } else {
        if (state.activeCountdownInterval) clearInterval(state.activeCountdownInterval);
        elements.holdCountdown.textContent = booking.status || 'EXPIRED';
        elements.timerFill.style.width = '0%';
    }

    showView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMyBookingsModal() {
    elements.modalBookingsList.innerHTML = '';

    if (state.activeBookings.length === 0) {
        elements.modalBookingsList.innerHTML = `
            <div class="empty-bookings-state">
                <span>🎫</span>
                <h4>No active bookings</h4>
                <p>Find parking near your Metro station and reserve a slot in seconds.</p>
            </div>
        `;
        return;
    }

    const now = Date.now();

    state.activeBookings.forEach(b => {
        const item = document.createElement('div');
        item.className = 'booking-item-card';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.title = 'Click to open pass details';

        const isStillValidTime = b.expiresAtTimestamp ? b.expiresAtTimestamp > now : true;
        const isActive = b.status === 'ACTIVE' && isStillValidTime;
        const remainingMs = (b.expiresAtTimestamp || 0) - now;
        const minsLeft = isActive ? Math.max(0, Math.ceil(remainingMs / 60000)) : 0;
        const displayStatus = isActive ? `HELD (${minsLeft}m left)` : (b.status || 'EXPIRED');

        item.innerHTML = `
            <div class="booking-item-header">
                <div>
                    <strong>${b.bookingId}</strong> • <span style="font-weight:700; color: #4263eb;">${b.parkingName}</span>
                </div>
                <span class="item-status-pill ${isActive ? 'active' : 'expired'}">
                    ${displayStatus}
                </span>
            </div>

            <div class="booking-item-grid">
                <div><strong>Station:</strong><br>${b.stationName}</div>
                <div><strong>Slot:</strong><br>${b.slotNumber}</div>
                <div><strong>Distance:</strong><br>${b.distance}m</div>
            </div>

            <div class="booking-item-actions">
                <span class="view-pass-hint">View Pass & QR Details →</span>
                ${isActive ? `<button class="cancel-booking-btn" data-id="${b.bookingId}">Cancel Slot</button>` : ''}
            </div>
        `;

        // Clicking anywhere on the card opens the full pass details
        item.addEventListener('click', (e) => {
            if (e.target.closest('.cancel-booking-btn')) return;
            openBookingDetails(b);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.closest('.cancel-booking-btn')) return;
                e.preventDefault();
                openBookingDetails(b);
            }
        });

        const cancelBtn = item.querySelector('.cancel-booking-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Cancel reservation for slot ${b.slotNumber}?`)) {
                    cancelBooking(b.bookingId);
                }
            });
        }

        elements.modalBookingsList.appendChild(item);
    });
}

async function openMyBookingsModal() {
    await syncBookings();
    renderMyBookingsModal();
    elements.bookingModal.style.display = 'flex';
}

function closeMyBookingsModal() {
    elements.bookingModal.style.display = 'none';
}

// ================= EVENT LISTENERS =================
// Navigate to Home when clicking or pressing Enter on brand logo
function navigateToHome() {
    closeMyBookingsModal();
    showView('home');
    updateHeroPreview();
}

if (elements.navLogo) {
    elements.navLogo.addEventListener('click', navigateToHome);
    elements.navLogo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateToHome();
        }
    });
}

elements.stationSelect.addEventListener('change', updateHeroPreview);
elements.timePicker.addEventListener('change', updateHeroPreview);
elements.findParkingBtn.addEventListener('click', renderParkingResults);
elements.backBtn.addEventListener('click', () => showView('home'));
elements.reservationBack.addEventListener('click', () => showView('results'));
elements.confirmBookingBtn.addEventListener('click', confirmReservation);
elements.homeBtn.addEventListener('click', () => showView('home'));
elements.viewBookingsBtn.addEventListener('click', openMyBookingsModal);

elements.myBookingNavBtn.addEventListener('click', openMyBookingsModal);
elements.closeModalBtn.addEventListener('click', closeMyBookingsModal);
elements.bookingModal.addEventListener('click', (e) => {
    if (e.target === elements.bookingModal) closeMyBookingsModal();
});

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', async () => {
    await checkBackendConnection();
    await syncBookings();
    updateHeroPreview();
    updateBookingCountBadge();
});