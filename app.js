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
                // NEW: Transportation and accommodation fields
                transportation: '',
                accommodation: '',
                transportationOptions: [],
                accommodationOptions: [],
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
            // Update state with trip data (including new transport/accommodation fields)
            Object.assign(this.state.trip, tripData);

            // Show enhanced loading state
            this.notification.show('🧠 Analyzing your trip requirements...', 'info', 2000);
            
            // NEW: Show transport/accommodation specific loading messages
            setTimeout(() => {
                if (tripData.transportation) {
                    const transportMessages = {
                        'plane': '✈️ Adding flight-specific items and TSA compliance...',
                        'car': '🚗 Including road trip essentials and emergency kit...',
                        'train': '🚊 Adding train comfort items...',
                        'ferry': '⛴️ Including ferry travel preparations...',
                        'bus': '🚌 Adding bus travel comfort items...'
                    };
                    this.notification.show(transportMessages[tripData.transportation] || 'Adding transportation items...', 'info', 2000);
                }
            }, 1000);

            setTimeout(() => {
                if (tripData.accommodation) {
                    const accommodationMessages = {
                        'hotel': '🏨 Optimizing for hotel stay (toiletries provided)...',
                        'airbnb': '🏠 Adding vacation rental essentials (bring everything)...',
                        'camping': '⛺ Including complete camping setup...',
                        'hostel': '🏨 Adding hostel security and shared facility items...',
                        'family': '👨‍👩‍👧‍👦 Including courtesy items for family stay...'
                    };
                    this.notification.show(accommodationMessages[tripData.accommodation] || 'Adding accommodation items...', 'info', 2000);
                }
            }, 2000);

            // Fetch weather data
            if (tripData.location) {
                await this.weatherDisplay.fetchWeather(tripData.location, tripData.nights);
                this.state.trip.weather = this.weatherDisplay.getWeatherData();
            }

            // Generate items based on all parameters (enhanced with transport/accommodation)
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

            // NEW: Enhanced success notification with context
            const contextInfo = [];
            if (tripData.transportation) contextInfo.push(tripData.transportation);
            if (tripData.accommodation) contextInfo.push(tripData.accommodation);
            
            const contextText = contextInfo.length > 0 ? ` for ${contextInfo.join(' + ')}` : '';
            this.notification.show(`🎯 Smart packing list generated${contextText}!`, 'success', 4000);

            // NEW: Show additional insights
            this.showGenerationInsights(tripData, generatedItems);

        } catch (error) {
            console.error('Error generating trip:', error);
            this.notification.show('Failed to generate list. Please try again.', 'error');
        }
    }

    // NEW: Show insights about what was generated
    showGenerationInsights(tripData, items) {
        const insights = [];
        const categoryCount = Object.keys(items).length;
        let totalItems = 0;
        
        for (const categoryItems of Object.values(items)) {
            totalItems += Object.keys(categoryItems).length;
        }

        // Transport-specific insights
        if (tripData.transportation === 'plane') {
            if (tripData.transportationOptions?.includes('international')) {
                insights.push('🌍 International flight requirements added');
            }
            if (tripData.transportationOptions?.includes('carryonly')) {
                insights.push('🧳 Carry-on restrictions applied');
            }
        }

        // Accommodation-specific insights
        if (tripData.accommodation === 'hotel') {
            insights.push('🏨 Hotel amenities considered - basic toiletries excluded');
        } else if (tripData.accommodation === 'camping') {
            insights.push('⛺ Complete camping self-sufficiency included');
        }

        // Show summary insight
        setTimeout(() => {
            this.notification.show(
                `📊 Generated ${totalItems} items across ${categoryCount} categories`, 
                'info', 
                3000
            );
        }, 3000);

        // Show specific insights
        insights.forEach((insight, index) => {
            setTimeout(() => {
                this.notification.show(insight, 'info', 2500);
            }, 4000 + (index * 1500));
        });
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

            // NEW: Enhanced notifications with category context
            const categoryName = this.getCategoryDisplayName(category);
            if (item.completed) {
                this.notification.show(`✅ ${itemName} packed! (${categoryName})`, 'success', 2000);
            } else {
                this.notification.show(`📦 ${itemName} unpacked (${categoryName})`, 'info', 2000);
            }
        }
    }

    // NEW: Get friendly category display name
    getCategoryDisplayName(categoryKey) {
        const categoryNames = {
            'flight_essentials': 'Flight Essentials',
            'carry_on_items': 'Carry-On',
            'hotel_essentials': 'Hotel',
            'airbnb_essentials': 'Vacation Rental',
            'car_travel': 'Road Trip',
            'international_travel': 'International',
            // Add more as needed...
        };
        return categoryNames[categoryKey] || categoryKey.replace('_', ' ');
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
            custom: true // NEW: Mark as custom item
        };

        // Re-render checklist
        this.checklistDisplay.render(this.state.trip.items, this.state.trip);
        this.progressTracking.update(this.calculateProgress());

        // Save state
        this.storage.saveTrip(this.state.trip);

        const categoryName = this.getCategoryDisplayName(category);
        this.notification.show(`✨ Added "${itemName}" to ${categoryName}`, 'success');
    }

    handleNoteUpdate(category, itemName, note) {
        if (this.state.trip.items[category] && this.state.trip.items[category][itemName]) {
            this.state.trip.items[category][itemName].notes = note;
            this.storage.saveTrip(this.state.trip);
        }
    }

    async handleSave() {
        const savedTrips = await this.storage.getSavedTrips();
        
        // NEW: Generate smarter default name
        const defaultName = this.generateTripName(this.state.trip);
        const tripName = prompt('Enter a name for this trip:', defaultName);
        
        if (!tripName) return;

        savedTrips[tripName] = { ...this.state.trip };
        this.storage.saveTripToLibrary(tripName, this.state.trip);
        
        // NEW: Enhanced save notification
        const context = [];
        if (this.state.trip.transportation) context.push(this.state.trip.transportation);
        if (this.state.trip.accommodation) context.push(this.state.trip.accommodation);
        const contextText = context.length > 0 ? ` (${context.join(' + ')})` : '';
        
        this.notification.show(`💾 Trip "${tripName}" saved${contextText}!`, 'success');
    }

    // NEW: Generate smart trip name
    generateTripName(trip) {
        const parts = [];
        
        if (trip.location) parts.push(trip.location);
        if (trip.tripType && trip.tripType !== 'leisure') parts.push(trip.tripType);
        
        // Add transport/accommodation context if notable
        if (trip.transportation === 'car' && trip.accommodation === 'camping') {
            parts.push('car camping');
        } else if (trip.accommodation === 'hostel') {
            parts.push('hostel trip');
        } else if (trip.transportation === 'plane' && trip.transportationOptions?.includes('international')) {
            parts.push('international');
        }
        
        const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        parts.push(date);
        
        return parts.join(' - ');
    }

    async handleLoadTrip() {
        const savedTrips = await this.storage.getSavedTrips();
        const tripNames = Object.keys(savedTrips);

        if (tripNames.length === 0) {
            this.notification.show('No saved trips found', 'info');
            return;
        }

        // NEW: Enhanced trip selection with context
        const tripOptions = tripNames.map((name, i) => {
            const trip = savedTrips[name];
            const context = [];
            if (trip.transportation) context.push(trip.transportation);
            if (trip.accommodation) context.push(trip.accommodation);
            const contextText = context.length > 0 ? ` (${context.join(' + ')})` : '';
            return `${i + 1}. ${name}${contextText}`;
        }).join('\n');

        const tripName = prompt(
            `Choose a trip to load:\n${tripOptions}\n\nEnter trip name:`
        );

        if (tripName && savedTrips[tripName]) {
            this.state.trip = { ...savedTrips[tripName] };
            
            // Update all components
            this.tripSetup.loadTripData(this.state.trip);
            this.updateAllComponents();
            this.showAllSections();

            // NEW: Context-aware load notification
            const context = [];
            if (this.state.trip.transportation) context.push(this.state.trip.transportation);
            if (this.state.trip.accommodation) context.push(this.state.trip.accommodation);
            const contextText = context.length > 0 ? ` (${context.join(' + ')})` : '';

            this.notification.show(`📂 Loaded trip "${tripName}"${contextText}`, 'success');
        }
    }

    handleResetTrip() {
        if (confirm('Are you sure you want to reset everything? This will clear your current trip and all progress.')) {
            // Reset state (including new fields)
            this.state.trip = {
                location: '',
                nights: 5,
                tripType: 'business',
                startDate: '',
                notes: '',
                activities: [],
                transportation: '', // NEW
                accommodation: '', // NEW
                transportationOptions: [], // NEW
                accommodationOptions: [], // NEW
                weather: null,
                items: {},
                completedItems: []
            };

            // Reset all components
            this.tripSetup.reset();
            this.hideAllSections();

            // Clear storage
            this.storage.clearCurrentTrip();

            this.notification.show('🔄 Trip reset successfully!', 'info');
        }
    }

    async handleExport() {
        // NEW: Enhanced export with transport/accommodation context
        const exportText = await this.listGenerator.exportToText(this.state.trip);
        
        // Create filename with transport/accommodation context
        const filenameParts = [
            'packing-list',
            this.state.trip.location.replace(/[^a-zA-Z0-9]/g, '-'),
        ];
        
        if (this.state.trip.transportation) {
            filenameParts.push(this.state.trip.transportation);
        }
        if (this.state.trip.accommodation) {
            filenameParts.push(this.state.trip.accommodation);
        }
        
        filenameParts.push(new Date().toISOString().split('T')[0]);
        
        const filename = filenameParts.join('-') + '.txt';
        
        // Create download
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.notification.show('📤 Enhanced packing list exported!', 'success');
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

        // Update checklist with enhanced trip data
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
            // NEW: Ensure backward compatibility with old saved trips
            this.state.trip = {
                ...this.state.trip, // Default values
                ...savedTrip, // Saved values override defaults
                // Ensure new fields exist even in old saves
                transportation: savedTrip.transportation || '',
                accommodation: savedTrip.accommodation || '',
                transportationOptions: savedTrip.transportationOptions || [],
                accommodationOptions: savedTrip.accommodationOptions || []
            };
            
            this.tripSetup.loadTripData(this.state.trip);
            
            if (Object.keys(savedTrip.items).length > 0) {
                this.updateAllComponents();
                this.showAllSections();
                
                // NEW: Show restoration notification with context
                const context = [];
                if (this.state.trip.transportation) context.push(this.state.trip.transportation);
                if (this.state.trip.accommodation) context.push(this.state.trip.accommodation);
                const contextText = context.length > 0 ? ` (${context.join(' + ')})` : '';
                
                this.notification.show(`🔄 Previous trip restored${contextText}`, 'info', 3000);
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SmartTripPlanner();
});
