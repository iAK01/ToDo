// Trip Setup Component - handles the initial trip configuration form
export class TripSetup {
    constructor(options) {
        this.container = options.container;
        this.onGenerate = options.onGenerate;
        this.onLoad = options.onLoad;
        this.onReset = options.onReset;
        
        this.render();
        this.bindEvents();
        this.setDefaultDate();
    }

    render() {
        this.container.innerHTML = `
            <div class="trip-setup" id="tripSetup">
                <h2>🗺️ Plan Your Trip</h2>
                
                <!-- Basic Trip Info -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="location">📍 Destination</label>
                        <input type="text" id="location" placeholder="e.g., Athens, Greece">
                    </div>
                    <div class="form-group">
                        <label for="nights">🌙 Number of Nights</label>
                        <input type="number" id="nights" min="1" max="365" value="5">
                    </div>
                    <div class="form-group">
                        <label for="tripType">🎯 Trip Type</label>
                        <select id="tripType">
                            <option value="business">Business</option>
                            <option value="leisure">Leisure</option>
                            <option value="camping">Camping</option>
                            <option value="winter-sports">Winter Sports</option>
                            <option value="beach">Beach</option>
                            <option value="city-break">City Break</option>
                        </select>
                    </div>
                </div>

                <!-- NEW: Transportation & Accommodation Row -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="transportation">✈️ How are you traveling?</label>
                        <select id="transportation">
                            <option value="">Select transportation...</option>
                            <option value="plane">✈️ Flight</option>
                            <option value="car">🚗 Car/Road Trip</option>
                            <option value="train">🚊 Train</option>
                            <option value="ferry">⛴️ Ferry/Boat</option>
                            <option value="bus">🚌 Bus/Coach</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="accommodation">🏨 Where are you staying?</label>
                        <select id="accommodation">
                            <option value="">Select accommodation...</option>
                            <option value="hotel">🏨 Hotel</option>
                            <option value="airbnb">🏠 Airbnb/Vacation Rental</option>
                            <option value="camping">⛺ Camping</option>
                            <option value="hostel">🏨 Hostel</option>
                            <option value="family">👨‍👩‍👧‍👦 Family/Friends</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="startDate">📅 Start Date</label>
                        <input type="date" id="startDate">
                    </div>
                </div>

                <!-- NEW: Additional Options (conditional) -->
                <div class="form-row" id="additionalOptions" style="display: none;">
                    <div class="form-group" id="flightOptionsGroup" style="display: none;">
                        <label>✈️ Flight Details</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="internationalFlight" value="international"> International flight</label>
                            <label><input type="checkbox" id="longHaulFlight" value="longhaul"> Long-haul flight (6+ hours)</label>
                            <label><input type="checkbox" id="carryOnOnly" value="carryonly"> Carry-on only</label>
                        </div>
                    </div>
                    <div class="form-group" id="hotelOptionsGroup" style="display: none;">
                        <label>🏨 Hotel Type</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="luxuryHotel" value="luxury"> Luxury/Upscale hotel</label>
                            <label><input type="checkbox" id="businessHotel" value="business"> Business hotel</label>
                            <label><input type="checkbox" id="resortHotel" value="resort"> Resort/All-inclusive</label>
                        </div>
                    </div>
                    <div class="form-group" id="carOptionsGroup" style="display: none;">
                        <label>🚗 Road Trip Details</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="longRoadTrip" value="longtrip"> Long road trip (8+ hours)</label>
                            <label><input type="checkbox" id="rentalCar" value="rental"> Rental car</label>
                            <label><input type="checkbox" id="crossBorder" value="crossborder"> Crossing borders</label>
                        </div>
                    </div>
                </div>
                
                <!-- Activities Section -->
                <div class="form-row">
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label>🎯 Activities (check all that apply):</label>
                        <div class="activities-grid">
                            <label><input type="checkbox" id="activity-business" value="business"> 💼 Business meetings</label>
                            <label><input type="checkbox" id="activity-sightseeing" value="sightseeing"> 🏛️ Sightseeing</label>
                            <label><input type="checkbox" id="activity-hiking" value="hiking"> 🥾 Hiking</label>
                            <label><input type="checkbox" id="activity-beach" value="beach"> 🏖️ Beach</label>
                            <label><input type="checkbox" id="activity-workout" value="workout"> 💪 Gym & fitness</label>
                            <label><input type="checkbox" id="activity-photography" value="photography"> 📸 Photography</label>
                        </div>
                    </div>
                </div>
                
                <!-- Notes Section -->
                <div class="form-row">
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label for="notes">📝 Special Notes</label>
                        <textarea id="notes" rows="3" placeholder="Any special requirements, events, or activities... (e.g., 'attending wedding', 'business conference', 'bringing baby')"></textarea>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="button-group">
                    <button class="btn btn-primary" id="generateBtn">🚀 Generate Smart List</button>
                    <button class="btn btn-secondary" id="loadBtn">📂 Load Saved Trip</button>
                    <button class="btn btn-danger" id="resetBtn">🔄 Reset Everything</button>
                </div>

                <!-- NEW: Smart Tips Section -->
                <div class="smart-tips" id="smartTips" style="display: none;">
                    <h4>💡 Smart Tips</h4>
                    <ul id="tipsList"></ul>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Button click handlers
        document.getElementById('generateBtn').addEventListener('click', () => this.handleGenerate());
        document.getElementById('loadBtn').addEventListener('click', () => this.onLoad());
        document.getElementById('resetBtn').addEventListener('click', () => this.onReset());

        // Enter key on location field
        document.getElementById('location').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGenerate();
            }
        });

        // NEW: Transportation change handler
        document.getElementById('transportation').addEventListener('change', (e) => {
            this.handleTransportationChange(e.target.value);
        });

        // NEW: Accommodation change handler
        document.getElementById('accommodation').addEventListener('change', (e) => {
            this.handleAccommodationChange(e.target.value);
        });

        // NEW: Trip type change handler (enhanced)
        document.getElementById('tripType').addEventListener('change', (e) => {
            this.handleTripTypeChange(e.target.value);
        });

        // NEW: Location change handler for smart suggestions
        document.getElementById('location').addEventListener('input', (e) => {
            this.handleLocationChange(e.target.value);
        });
    }

    handleTransportationChange(transportType) {
        const additionalOptions = document.getElementById('additionalOptions');
        const flightOptions = document.getElementById('flightOptionsGroup');
        const carOptions = document.getElementById('carOptionsGroup');
        
        // Hide all option groups first
        flightOptions.style.display = 'none';
        carOptions.style.display = 'none';
        
        // Show relevant options
        if (transportType === 'plane') {
            additionalOptions.style.display = 'block';
            flightOptions.style.display = 'block';
        } else if (transportType === 'car') {
            additionalOptions.style.display = 'block';
            carOptions.style.display = 'block';
        } else if (transportType === '') {
            additionalOptions.style.display = 'none';
        }
        
        this.updateSmartTips();
    }

    handleAccommodationChange(accommodationType) {
        const additionalOptions = document.getElementById('additionalOptions');
        const hotelOptions = document.getElementById('hotelOptionsGroup');
        
        // Show/hide hotel options
        if (accommodationType === 'hotel') {
            additionalOptions.style.display = 'block';
            hotelOptions.style.display = 'block';
        } else {
            hotelOptions.style.display = 'none';
            // Only hide additionalOptions if no transport options are showing
            const transportType = document.getElementById('transportation').value;
            if (!transportType || (transportType !== 'plane' && transportType !== 'car')) {
                additionalOptions.style.display = 'none';
            }
        }
        
        this.updateSmartTips();
    }

    handleTripTypeChange(tripType) {
        // Auto-suggest transportation/accommodation based on trip type
        const transportSelect = document.getElementById('transportation');
        const accommodationSelect = document.getElementById('accommodation');
        
        // Smart defaults based on trip type
        const suggestions = {
            'business': { 
                transport: 'plane', 
                accommodation: 'hotel',
                activities: ['business']
            },
            'camping': { 
                transport: 'car', 
                accommodation: 'camping',
                activities: ['hiking']
            },
            'beach': { 
                transport: 'plane', 
                accommodation: 'hotel',
                activities: ['beach']
            },
            'city-break': { 
                transport: 'plane', 
                accommodation: 'hotel',
                activities: ['sightseeing']
            }
        };
        
        const suggestion = suggestions[tripType];
        if (suggestion && !transportSelect.value) {
            transportSelect.value = suggestion.transport;
            this.handleTransportationChange(suggestion.transport);
        }
        if (suggestion && !accommodationSelect.value) {
            accommodationSelect.value = suggestion.accommodation;
            this.handleAccommodationChange(suggestion.accommodation);
        }
        
        // Auto-check suggested activities
        if (suggestion && suggestion.activities) {
            suggestion.activities.forEach(activity => {
                const checkbox = document.getElementById(`activity-${activity}`);
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                }
            });
        }
        
        this.updateSmartTips();
    }

    handleLocationChange(location) {
        // Simple international detection
        const isInternational = location.includes(',') || 
                               location.toLowerCase().includes('uk') ||
                               location.toLowerCase().includes('europe') ||
                               location.toLowerCase().includes('asia');
        
        if (isInternational) {
            const internationalCheckbox = document.getElementById('internationalFlight');
            if (internationalCheckbox) {
                internationalCheckbox.checked = true;
            }
        }
        
        this.updateSmartTips();
    }

    updateSmartTips() {
        const tips = [];
        const transportType = document.getElementById('transportation').value;
        const accommodationType = document.getElementById('accommodation').value;
        const location = document.getElementById('location').value;
        
        // Transportation tips
        if (transportType === 'plane') {
            tips.push('✈️ Remember TSA 3-1-1 rule for carry-on liquids');
            tips.push('📱 Download your airline\'s app for real-time updates');
            if (document.getElementById('internationalFlight')?.checked) {
                tips.push('🛂 Check passport expiration (6+ months validity required)');
            }
            if (document.getElementById('longHaulFlight')?.checked) {
                tips.push('🧦 Consider compression socks for circulation');
            }
        } else if (transportType === 'car') {
            tips.push('🚗 Check your car insurance coverage for trip area');
            tips.push('🗺️ Download offline maps in case of poor signal');
        }
        
        // Accommodation tips
        if (accommodationType === 'hotel') {
            tips.push('🏨 Hotel provides towels and basic toiletries');
            if (document.getElementById('luxuryHotel')?.checked) {
                tips.push('👔 Some hotel restaurants have dress codes');
            }
        } else if (accommodationType === 'airbnb') {
            tips.push('🏠 Bring all toiletries - nothing is provided');
            tips.push('🧽 Leave it clean - bring basic cleaning supplies');
        } else if (accommodationType === 'hostel') {
            tips.push('🔒 Bring a padlock for lockers');
            tips.push('🩴 Flip flops for shared showers');
        } else if (accommodationType === 'camping') {
            tips.push('⛺ Check weather forecast for appropriate gear');
            tips.push('🔋 Bring extra batteries for all devices');
        }
        
        // Show/hide tips section
        const tipsSection = document.getElementById('smartTips');
        const tipsList = document.getElementById('tipsList');
        
        if (tips.length > 0) {
            tipsSection.style.display = 'block';
            tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
        } else {
            tipsSection.style.display = 'none';
        }
    }

    handleGenerate() {
        const tripData = this.getTripData();
        
        if (!tripData.location || !tripData.nights) {
            alert('Please enter destination and number of nights');
            return;
        }

        // NEW: Validate transportation and accommodation
        if (!tripData.transportation) {
            if (!confirm('No transportation method selected. Continue anyway?')) {
                return;
            }
        }

        if (!tripData.accommodation) {
            if (!confirm('No accommodation type selected. Continue anyway?')) {
                return;
            }
        }

        this.onGenerate(tripData);
    }

    getTripData() {
        // Get selected activities
        const activities = [];
        document.querySelectorAll('input[id^="activity-"]:checked').forEach(checkbox => {
            activities.push(checkbox.value);
        });

        // NEW: Get transportation options
        const transportationOptions = [];
        if (document.getElementById('internationalFlight')?.checked) {
            transportationOptions.push('international');
        }
        if (document.getElementById('longHaulFlight')?.checked) {
            transportationOptions.push('longhaul');
        }
        if (document.getElementById('carryOnOnly')?.checked) {
            transportationOptions.push('carryonly');
        }
        if (document.getElementById('longRoadTrip')?.checked) {
            transportationOptions.push('longtrip');
        }
        if (document.getElementById('rentalCar')?.checked) {
            transportationOptions.push('rental');
        }
        if (document.getElementById('crossBorder')?.checked) {
            transportationOptions.push('crossborder');
        }

        // NEW: Get accommodation options
        const accommodationOptions = [];
        if (document.getElementById('luxuryHotel')?.checked) {
            accommodationOptions.push('luxury');
        }
        if (document.getElementById('businessHotel')?.checked) {
            accommodationOptions.push('business');
        }
        if (document.getElementById('resortHotel')?.checked) {
            accommodationOptions.push('resort');
        }

        return {
            location: document.getElementById('location').value.trim(),
            nights: parseInt(document.getElementById('nights').value),
            tripType: document.getElementById('tripType').value,
            startDate: document.getElementById('startDate').value,
            notes: document.getElementById('notes').value.trim(),
            activities: activities,
            // NEW: Transportation and accommodation data
            transportation: document.getElementById('transportation').value,
            accommodation: document.getElementById('accommodation').value,
            transportationOptions: transportationOptions,
            accommodationOptions: accommodationOptions
        };
    }

    loadTripData(trip) {
        document.getElementById('location').value = trip.location || '';
        document.getElementById('nights').value = trip.nights || 5;
        document.getElementById('tripType').value = trip.tripType || 'business';
        document.getElementById('startDate').value = trip.startDate || '';
        document.getElementById('notes').value = trip.notes || '';

        // Load activities
        document.querySelectorAll('input[id^="activity-"]').forEach(checkbox => {
            checkbox.checked = trip.activities && trip.activities.includes(checkbox.value);
        });

        // NEW: Load transportation and accommodation
        if (trip.transportation) {
            document.getElementById('transportation').value = trip.transportation;
            this.handleTransportationChange(trip.transportation);
        }
        if (trip.accommodation) {
            document.getElementById('accommodation').value = trip.accommodation;
            this.handleAccommodationChange(trip.accommodation);
        }

        // NEW: Load transportation options
        if (trip.transportationOptions) {
            trip.transportationOptions.forEach(option => {
                const checkbox = document.getElementById(option + 'Flight') || 
                                document.getElementById('longRoadTrip') ||
                                document.getElementById('rentalCar') ||
                                document.getElementById('crossBorder');
                if (checkbox) checkbox.checked = true;
            });
        }

        // NEW: Load accommodation options
        if (trip.accommodationOptions) {
            trip.accommodationOptions.forEach(option => {
                const checkbox = document.getElementById(option + 'Hotel');
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    reset() {
        document.getElementById('location').value = '';
        document.getElementById('nights').value = '5';
        document.getElementById('tripType').value = 'business';
        document.getElementById('notes').value = '';
        
        // Reset activities
        document.querySelectorAll('input[id^="activity-"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // NEW: Reset transportation and accommodation
        document.getElementById('transportation').value = '';
        document.getElementById('accommodation').value = '';
        
        // Reset all option checkboxes
        document.querySelectorAll('#additionalOptions input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Hide additional options
        document.getElementById('additionalOptions').style.display = 'none';
        document.getElementById('smartTips').style.display = 'none';
        
        this.setDefaultDate();
    }

    setDefaultDate() {
        const today = new Date();
        document.getElementById('startDate').value = today.toISOString().split('T')[0];
    }
}
