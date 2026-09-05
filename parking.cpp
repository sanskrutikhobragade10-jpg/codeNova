#include <bits/stdc++.h>
using namespace std;

struct Parking {
    string name;
    int totalSlots;
    int availableSlots;
    int distance;
};
double calculateAvailability(Parking parking) {
    return (double)parking.availableSlots / parking.totalSlots * 100;
}
double calculateDistanceScore(Parking parking, int closestDistance, int farthestDistance) {

    return (double)(farthestDistance - parking.distance)
           / (farthestDistance - closestDistance) * 100;

}

string predictDemand(int hour) {

    if (hour >= 6 && hour < 8) {
        return "Low";
    }
    else if (hour >= 8 && hour < 10) {
        return "High";
    }
    else if (hour >= 10 && hour < 16) {
        return "Medium";
    }
    else if (hour >= 16 && hour < 19) {
        return "High";
    }
    else {
        return "Low";
    }
}

double calculateDemandScore(string demand) {

    if (demand == "Low") {
        return 100;
    }
    else if (demand == "Medium") {
        return 60;
    }
    else {
        return 30;
    }
}

void expireReservation(Parking &parking) {

    parking.availableSlots++;

    cout << endl;
    cout << "===== RESERVATION EXPIRED =====" << endl;
    cout << "Slot released at " << parking.name << endl;
    cout << "Available Slots: " << parking.availableSlots << endl;
}

int main() {

    Parking parkingA;
    parkingA.name = "Parking A";
    parkingA.totalSlots = 20;
    parkingA.availableSlots = 5;
    parkingA.distance = 150;

    Parking parkingB;
    parkingB.name = "Parking B";
    parkingB.totalSlots = 30;
    parkingB.availableSlots = 18;
    parkingB.distance = 250;

    Parking parkingC;
    parkingC.name = "Parking C";
    parkingC.totalSlots = 40;
    parkingC.availableSlots = 25;
    parkingC.distance = 400;

    int currentHour = 9;

string demand = predictDemand(currentHour);
double demandScore = calculateDemandScore(demand);


cout << endl;
cout << "Current Hour: " << currentHour << ":00" << endl;
cout << "Predicted Demand: " << demand << endl;
cout << "Demand Score: " << demandScore << endl;

    int closestDistance = min({
    parkingA.distance,
    parkingB.distance,
    parkingC.distance
});

int farthestDistance = max({
    parkingA.distance,
    parkingB.distance,
    parkingC.distance
});

double distanceScoreA =
    calculateDistanceScore(parkingA, closestDistance, farthestDistance);

    double availabilityScoreA = calculateAvailability(parkingA);

double smartScoreA =
    availabilityScoreA * 0.40
    + distanceScoreA * 0.30
    + demandScore * 0.30;

double distanceScoreB =
    calculateDistanceScore(parkingB, closestDistance, farthestDistance);

    double availabilityScoreB = calculateAvailability(parkingB);

double smartScoreB =
    availabilityScoreB * 0.40
    + distanceScoreB * 0.30
    + demandScore * 0.30;

double distanceScoreC =
    calculateDistanceScore(parkingC, closestDistance, farthestDistance);

    double availabilityScoreC = calculateAvailability(parkingC);

double smartScoreC =
    availabilityScoreC * 0.40
    + distanceScoreC * 0.30
    + demandScore * 0.30;

    double highestSmartScore = smartScoreA;
string recommendedParking = parkingA.name;

if (smartScoreB > highestSmartScore) {
    highestSmartScore = smartScoreB;
    recommendedParking = parkingB.name;
}

if (smartScoreC > highestSmartScore) {
    highestSmartScore = smartScoreC;
    recommendedParking = parkingC.name;
}


cout << endl;
cout << "===== SMART RECOMMENDATION =====" << endl;
cout << "Recommended Parking: " << recommendedParking << endl;
cout << "Smart Score: " << highestSmartScore << endl;


    cout << endl;
cout << "Availability Percentage" << endl;

cout << parkingA.name << ": "
     << calculateAvailability(parkingA) << "%" << endl;

cout << parkingB.name << ": "
     << calculateAvailability(parkingB) << "%" << endl;

cout << parkingC.name << ": "
     << calculateAvailability(parkingC) << "%" << endl;

     double availabilityA = calculateAvailability(parkingA);
double availabilityB = calculateAvailability(parkingB);
double availabilityC = calculateAvailability(parkingC);



string bestParking;
double highestAvailability;

if (availabilityA >= availabilityB && availabilityA >= availabilityC) {
    bestParking = parkingA.name;
    highestAvailability = availabilityA;
}
else if (availabilityB >= availabilityA && availabilityB >= availabilityC) {
    bestParking = parkingB.name;
    highestAvailability = availabilityB;
}
else {
    bestParking = parkingC.name;
    highestAvailability = availabilityC;
}

    cout << "----- METROPARK PARKING -----" << endl;

    cout << endl;

    cout << parkingA.name << endl;
    cout << "Total Slots: " << parkingA.totalSlots << endl;
    cout << "Available Slots: " << parkingA.availableSlots << endl;
    cout << "Distance: " << parkingA.distance << " meters" << endl;

    cout << endl;

    cout << parkingB.name << endl;
    cout << "Total Slots: " << parkingB.totalSlots << endl;
    cout << "Available Slots: " << parkingB.availableSlots << endl;
    cout << "Distance: " << parkingB.distance << " meters" << endl;

    cout << endl;

    cout << parkingC.name << endl;
    cout << "Total Slots: " << parkingC.totalSlots << endl;
    cout << "Available Slots: " << parkingC.availableSlots << endl;
    cout << "Distance: " << parkingC.distance << " meters" << endl;

    cout << endl;
cout << "Parking with highest availability: " << bestParking << endl;
cout << "Availability: " << highestAvailability << "%" << endl;

cout << endl;
cout << "Distance Scores" << endl;

cout << parkingA.name << ": "
     << distanceScoreA << endl;

cout << parkingB.name << ": "
     << distanceScoreB << endl;

cout << parkingC.name << ": "
     << distanceScoreC << endl;

     cout << endl;
cout << "Smart Score - Parking A: " << smartScoreA << endl;
cout << "Smart Score - Parking B: " << smartScoreB << endl;
cout << "Smart Score - Parking C: " << smartScoreC << endl;

cout << endl;
cout << "===== RESERVATION =====" << endl;



 if (parkingB.availableSlots > 0) {

    parkingB.availableSlots--;
    int bookingID = 1001;
    int occupiedSlots = parkingB.totalSlots - parkingB.availableSlots;
    string slotNumber = "B-" + to_string(occupiedSlots);

    cout << "Slot reserved at " << parkingB.name << endl;
    cout << "Booking ID: MP" << bookingID << endl;
    cout << "Assigned Slot: " << slotNumber << endl;
    cout << "Remaining Slots: " << parkingB.availableSlots << endl;

}
else {

    cout << "Sorry! No slots available at " << parkingB.name << endl;
    
 
}
expireReservation(parkingB);

    return 0;
}
