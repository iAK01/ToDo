// Trip configuration data - defines trip types and their characteristics
export const tripConfig = {
    tripTypes: {
        business: {
            name: 'Business',
            description: 'Professional travel for work or conferences',
            defaultActivities: ['business'],
            suggestedItems: {
                business_items: {
                    'Laptop & charger': { multiplier: 0, essential: true },
                    'Business cards': { multiplier: 0, essential: true },
                    'Notebook & pens': { multiplier: 0, essential: true },
                    'Portable charger': { multiplier: 0, essential: true }
                }
            }
        },
        leisure: {
            name: 'Leisure',
            description: 'Vacation and relaxation travel',
            defaultActivities: ['sightseeing'],
            suggestedItems: {
                activity_items: {
                    'Camera': { multiplier: 0, essential: false },
                    'Guidebook': { multiplier: 0, essential: false },
                    'Comfortable walking shoes': { multiplier: 0, essential: true }
                }
            }
        },
        camping: {
            name: 'Camping',
            description: 'Outdoor camping and wilderness trips',
            defaultActivities: ['hiking'],
            suggestedItems: {
                camping_gear: {
                    'Tent': { multiplier: 0, essential: true },
                    'Sleeping bag': { multiplier: 0, essential: true },
                    'Camping stove': { multiplier: 0, essential: true },
                    'Flashlight/headlamp': { multiplier: 0, essential: true },
                    'First aid kit': { multiplier: 0, essential: true }
                }
            }
        },
        'winter-sports': {
            name: 'Winter Sports',
            description: 'Skiing, snowboarding, and winter activities',
            defaultActivities: [],
            suggestedItems: {
                winter_sports_gear: {
                    'Ski/snowboard jacket': { multiplier: 0, essential: true },
                    'Snow pants': { multiplier: 0, essential: true },
                    'Thermal underwear': { multiplier: 0.6, essential: true },
                    'Goggles': { multiplier: 0, essential: true },
                    'Gloves': { multiplier: 0.2, essential: true }
                }
            }
        },
        beach: {
            name: 'Beach',
            description: 'Beach vacation and water activities',
            defaultActivities: ['beach'],
            suggestedItems: {
                beach_gear: {
                    'Swimwear': { multiplier: 0.4, essential: true, min: 2 },
                    'Beach towel': { multiplier: 0, essential: true },
                    'Sunscreen': { multiplier: 0, essential: true },
                    'Beach bag': { multiplier: 0, essential: false }
                }
            }
        },
        'city-break': {
            name: 'City Break',
            description: 'Short urban getaway',
            defaultActivities: ['sightseeing'],
            suggestedItems: {
                city_items: {
                    'City map/app': { multiplier: 0, essential: true },
                    'Comfortable walking shoes': { multiplier: 0, essential: true },
                    'Light daypack': { multiplier: 0, essential: true }
                }
            }
        }
    },
    
    activities: {
        business: {
            name: 'Business Meetings',
            icon: '💼',
            requiredItems: ['Business attire', 'Laptop', 'Business cards']
        },
        sightseeing: {
            name: 'Sightseeing',
            icon: '🏛️',
            requiredItems: ['Camera', 'Comfortable shoes', 'Daypack']
        },
        hiking: {
            name: 'Hiking',
            icon: '🥾',
            requiredItems: ['Hiking boots', 'Backpack', 'Water bottle']
        },
        beach: {
            name: 'Beach Activities',
            icon: '🏖️',
            requiredItems: ['Swimwear', 'Beach towel', 'Sunscreen']
        },
        workout: {
            name: 'Gym & Fitness',
            icon: '💪',
            requiredItems: ['Workout clothes', 'Sports shoes', 'Gym towel']
        },
        photography: {
            name: 'Photography',
            icon: '📸',
            requiredItems: ['Camera', 'Extra batteries', 'Memory cards']
        }
    }
};
