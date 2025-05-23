// Main application entry point
import { TripSetup } from './components/trip-setup.js';
import { ChecklistDisplay } from './components/checklist-display.js';
import { ProgressTracking } from './components/progress-tracking.js';
import { WeatherDisplay } from './components/weather-display.js';
import { ControlPanel } from './components/control-panel.js';
import { StorageManager } from './utils/storage-manager.js';
import { ListGenerator } from './utils/list-generator.js';
import { NotificationManager } from './utils/notification-manager.js';
import { tripConfig } from './data/trip-config.js';

class SmartTripPlanner {
    constructor() {
        this.state = {
            trip: {
                location: '',
                nights: 5,
                tripType: 'business',
                startDate: '',
                notes: '',
                activities: [],
                weather: null,
                items: {},
                completedItems: []
            }
        };

        this.storage = new StorageManager();
        this.listGenerator = new ListGenerator();
        this.notification = new NotificationManager();
        
        this.initializeComponents();
        this.bindEvents();
        this.loadSavedState();
    }

    initializeComponents() {
        // Initialize each component with callbacks
        this.tripSetup = new TripSetup({
            container: document.getElementById('trip-setup-section'),
            onGenerate: (tripData) => this.handleGenerateTrip(tripData),
            onLoad: () => this.handleLoadTrip(),
            onReset: () => this.handleResetTrip()
        });

        this.weatherDisplay = new WeatherDisplay({
            container: document.getElementById('weather-display-section')
        });

        this.progressTracking = new ProgressTracking({
            container: document.getElementById('progress-tracking-section')
        });

        this.checklistDisplay = new ChecklistDisplay({
            container: document.getElementById('checklist-display-section'),
            onItemToggle: (category, item) => this.handleItemToggle(category, item),
            onItemAdd: (category, item, quantity) => this.handleItemAdd(category, item, quantity),
            onNoteUpdate: (category, item, note) => this.handleNoteUpdate(category, item, note)
        });

        this.controlPanel = new ControlPanel({
            container: document.getElementById('control-panel'),
            onExport: () => this.handleExport(),
            onSave: () => this.handleSave(),
            onScrollTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        });
    }

    bindEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.handleSave();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.handleExport();
                        break;
                    case 'r':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.handleResetTrip();
                        }
                        break;
                }
            }
        });

        // Auto-save every 30 seconds
        setInterval(() => {
            if (Object.keys(this.state.trip.items).length > 0) {
                this.storage.saveTrip(this.state.trip);
            }
        }, 30000);

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.storage.saveTrip(this.state.trip);
        });
    }

    async handleGenerateTrip(tripData) {
        try {
            // Update state with trip data
            Object.assign(this.state.trip, tripData);

            // Show loading state
            this.notification.show('Generating your smart packing list...', 'info');

            // Fetch weather data
            if (tripData.location) {
                await this.weatherDisplay.fetchWeather(tripData.location, tripData.nights);
                this.state.trip.weather = this.weatherDisplay.getWeatherData();
            }

            // Generate items based on all parameters
            const generatedItems = await this.listGenerator.generateItems({
                ...tripData,
                weather: this.state.trip.weather
            });

            this.state.trip.items = generatedItems;

            // Update all components
            this.updateAllComponents();

            // Show sections
            this.showAllSections();

            // Save state
            this.storage.saveTrip(this.state.trip);

            this.notification.show('Smart packing list generated! 🎯', 'success');

        } catch (error) {
            console.error('Error generating trip:', error);
            this.notification.show('Failed to generate list. Please try again.', 'error');
        }
    }

    handleItemToggle(category, itemName) {
        if (this.state.trip.items[category] && this.state.trip.items[category][itemName]) {
            const item = this.state.trip.items[category][itemName];
            item.completed = !item.completed;

            // Update displays
            this.checklistDisplay.updateItem(category, itemName, item);
            this.progressTracking.update(this.calculateProgress());

            // Save state
            this.storage.saveTrip(this.state.trip);

            // Show notification
            if (item.completed) {
                this.notification.show(`✅ ${itemName} packed!`, 'success');
            } else {
                this.notification.show(`📦 ${itemName} unpacked`, 'info');
            }
        }
    }

    handleItemAdd(category, itemName, quantity) {
        if (!this.state.trip.items[category]) {
            this.state.trip.items[category] = {};
        }

        this.state.trip.items[category][itemName] = {
            quantity: quantity,
            essential: false,
            completed: false,
            notes: '',
            custom: true
        };

        // Re-render checklist
        this.checklistDisplay.render(this.state.trip.items);
        this.progressTracking.update(this.calculateProgress());

        // Save state
        this.storage.saveTrip(this.state.trip);

        this.notification.show(`Added "${itemName}" to ${category}`, 'success');
    }

    handleNoteUpdate(category, itemName, note) {
        if (this.state.trip.items[category] && this.state.trip.items[category][itemName]) {
            this.state.trip.items[category][itemName].notes = note;
            this.storage.saveTrip(this.state.trip);
        }
    }

    async handleSave() {
        const savedTrips = await this.storage.getSavedTrips();
        const tripName = prompt('Enter a name for this trip:', 
            `${this.state.trip.location} - ${this.state.trip.tripType}`);
        
        if (!tripName) return;

        savedTrips[tripName] = { ...this.state.trip };
        this.storage.saveTripToLibrary(tripName, this.state.trip);
        
        this.notification.show(`Trip "${tripName}" saved!`, 'success');
    }

    async handleLoadTrip() {
        const savedTrips = await this.storage.getSavedTrips();
        const tripNames = Object.keys(savedTrips);

        if (tripNames.length === 0) {
            this.notification.show('No saved trips found', 'info');
            return;
        }

        const tripName = prompt(
            `Choose a trip to load:\n${tripNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}\n\nEnter trip name:`
        );

        if (tripName && savedTrips[tripName]) {
            this.state.trip = { ...savedTrips[tripName] };
            
            // Update all components
            this.tripSetup.loadTripData(this.state.trip);
            this.updateAllComponents();
            this.showAllSections();

            this.notification.show(`Loaded trip "${tripName}"`, 'success');
        }
    }

    handleResetTrip() {
        if (confirm('Are you sure you want to reset everything? This will clear your current trip and all progress.')) {
            // Reset state
            this.state.trip = {
                location: '',
                nights: 5,
                tripType: 'business',
                startDate: '',
                notes: '',
                activities: [],
                weather: null,
                items: {},
                completedItems: []
            };

            // Reset all components
            this.tripSetup.reset();
            this.hideAllSections();

            // Clear storage
            this.storage.clearCurrentTrip();

            this.notification.show('Trip reset successfully!', 'info');
        }
    }

    async handleExport() {
        const exportText = await this.listGenerator.exportToText(this.state.trip);
        
        // Create download
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packing-list-${this.state.trip.location.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.notification.show('Packing list exported!', 'success');
    }

    calculateProgress() {
        let totalItems = 0;
        let completedItems = 0;

        for (const items of Object.values(this.state.trip.items)) {
            for (const item of Object.values(items)) {
                totalItems++;
                if (item.completed) completedItems++;
            }
        }

        return {
            total: totalItems,
            completed: completedItems,
            percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
        };
    }

    updateAllComponents() {
        // Update weather display
        if (this.state.trip.weather) {
            this.weatherDisplay.render(this.state.trip.weather);
        }

        // Update checklist
        this.checklistDisplay.render(this.state.trip.items, this.state.trip);

        // Update progress
        this.progressTracking.update(this.calculateProgress());
    }

    showAllSections() {
        document.getElementById('weather-display-section').classList.remove('hidden');
        document.getElementById('progress-tracking-section').classList.remove('hidden');
        document.getElementById('checklist-display-section').classList.remove('hidden');
    }

    hideAllSections() {
        document.getElementById('weather-display-section').classList.add('hidden');
        document.getElementById('progress-tracking-section').classList.add('hidden');
        document.getElementById('checklist-display-section').classList.add('hidden');
    }

    async loadSavedState() {
        const savedTrip = await this.storage.getCurrentTrip();
        
        if (savedTrip && savedTrip.location) {
            this.state.trip = savedTrip;
            this.tripSetup.loadTripData(savedTrip);
            
            if (Object.keys(savedTrip.items).length > 0) {
                this.updateAllComponents();
                this.showAllSections();
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SmartTripPlanner();
});
