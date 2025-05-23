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
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="startDate">📅 Start Date</label>
                        <input type="date" id="startDate">
                    </div>
                    <div class="form-group">
                        <label for="notes">📝 Special Notes</label>
                        <textarea id="notes" rows="3" placeholder="Any special requirements or activities..."></textarea>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" id="generateBtn">🚀 Generate Smart List</button>
                    <button class="btn btn-secondary" id="loadBtn">📂 Load Saved Trip</button>
                    <button class="btn btn-danger" id="resetBtn">🔄 Reset Everything</button>
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
    }

    handleGenerate() {
        const tripData = this.getTripData();
        
        if (!tripData.location || !tripData.nights) {
            alert('Please enter destination and number of nights');
            return;
        }

        this.onGenerate(tripData);
    }

    getTripData() {
        // Get selected activities
        const activities = [];
        document.querySelectorAll('input[id^="activity-"]:checked').forEach(checkbox => {
            activities.push(checkbox.value);
        });

        return {
            location: document.getElementById('location').value.trim(),
            nights: parseInt(document.getElementById('nights').value),
            tripType: document.getElementById('tripType').value,
            startDate: document.getElementById('startDate').value,
            notes: document.getElementById('notes').value.trim(),
            activities: activities
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
    }

    reset() {
        document.getElementById('location').value = '';
        document.getElementById('nights').value = '5';
        document.getElementById('tripType').value = 'business';
        document.getElementById('notes').value = '';
        document.querySelectorAll('input[id^="activity-"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.setDefaultDate();
    }

    setDefaultDate() {
        const today = new Date();
        document.getElementById('startDate').value = today.toISOString().split('T')[0];
    }
}
