// Storage Manager - handles all localStorage operations
export class StorageManager {
    constructor() {
        this.CURRENT_TRIP_KEY = 'smart-trip-planner-current';
        this.SAVED_TRIPS_KEY = 'smart-trip-planner-saved';
    }

    // Current trip operations
    saveTrip(tripData) {
        try {
            const dataToSave = {
                ...tripData,
                lastModified: new Date().toISOString()
            };
            localStorage.setItem(this.CURRENT_TRIP_KEY, JSON.stringify(dataToSave));
            return true;
        } catch (error) {
            console.error('Failed to save trip:', error);
            return false;
        }
    }

    getCurrentTrip() {
        try {
            const saved = localStorage.getItem(this.CURRENT_TRIP_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
            return null;
        } catch (error) {
            console.error('Failed to load trip:', error);
            return null;
        }
    }

    clearCurrentTrip() {
        try {
            localStorage.removeItem(this.CURRENT_TRIP_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear trip:', error);
            return false;
        }
    }

    // Saved trips library operations
    saveTripToLibrary(tripName, tripData) {
        try {
            const savedTrips = this.getSavedTrips();
            savedTrips[tripName] = {
                ...tripData,
                savedDate: new Date().toISOString()
            };
            localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(savedTrips));
            return true;
        } catch (error) {
            console.error('Failed to save to library:', error);
            return false;
        }
    }

    getSavedTrips() {
        try {
            const saved = localStorage.getItem(this.SAVED_TRIPS_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
            return {};
        } catch (error) {
            console.error('Failed to load saved trips:', error);
            return {};
        }
    }

    deleteSavedTrip(tripName) {
        try {
            const savedTrips = this.getSavedTrips();
            delete savedTrips[tripName];
            localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(savedTrips));
            return true;
        } catch (error) {
            console.error('Failed to delete saved trip:', error);
            return false;
        }
    }

    // Export/Import operations
    exportAllData() {
        const data = {
            currentTrip: this.getCurrentTrip(),
            savedTrips: this.getSavedTrips(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate data structure
            if (!data.version || !data.exportDate) {
                throw new Error('Invalid data format');
            }
            
            // Import current trip
            if (data.currentTrip) {
                this.saveTrip(data.currentTrip);
            }
            
            // Import saved trips
            if (data.savedTrips) {
                localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(data.savedTrips));
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    // Storage usage info
    getStorageInfo() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (key.startsWith('smart-trip-planner')) {
                const item = localStorage.getItem(key);
                totalSize += item ? item.length : 0;
            }
        }
        
        return {
            usedBytes: totalSize,
            usedKB: (totalSize / 1024).toFixed(2),
            tripCount: Object.keys(this.getSavedTrips()).length
        };
    }

    // Cleanup old data
    cleanupOldTrips(daysToKeep = 90) {
        try {
            const savedTrips = this.getSavedTrips();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            let deletedCount = 0;
            
            for (const [tripName, tripData] of Object.entries(savedTrips)) {
                if (tripData.savedDate) {
                    const savedDate = new Date(tripData.savedDate);
                    if (savedDate < cutoffDate) {
                        delete savedTrips[tripName];
                        deletedCount++;
                    }
                }
            }
            
            if (deletedCount > 0) {
                localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(savedTrips));
            }
            
            return deletedCount;
        } catch (error) {
            console.error('Failed to cleanup old trips:', error);
            return 0;
        }
    }
}
