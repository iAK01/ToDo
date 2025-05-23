// Conditional rules - defines when items should be included/excluded
export const conditionalRules = {
    weather: {
        cold: {
            trigger: (weather) => weather.some(day => day.temp < 10),
            items: {
                'Warm jacket': { multiplier: 0, essential: true },
                'Thermal layers': { multiplier: 0.4, essential: true },
                'Warm hat': { multiplier: 0, essential: true },
                'Gloves': { multiplier: 0.2, essential: true },
                'Scarf': { multiplier: 0, essential: false },
                'Warm socks': { multiplier: 0.6, essential: true }
            }
        },
        hot: {
            trigger: (weather) => weather.some(day => day.temp > 25),
            items: {
                'Light breathable shirts': { 
                    multiplier: 0.8, 
                    essential: true,
                    description: 'Lightweight and breathable'
                },
                'Shorts': { multiplier: 0.4, essential: true },
                'Sun hat': { multiplier: 0, essential: true },
                'Sunglasses': { multiplier: 0, essential: true },
                'Extra sunscreen': { multiplier: 0, essential: true },
                'Sandals': { multiplier: 0, essential: false }
            }
        },
        rainy: {
            trigger: (weather) => weather.some(day => 
                day.condition.toLowerCase().includes('rain') || day.chanceOfRain > 40
            ),
            items: {
                'Waterproof jacket': { multiplier: 0, essential: true },
                'Compact umbrella': { multiplier: 0, essential: true },
                'Waterproof shoes': { multiplier: 0, essential: false },
                'Rain cover for bag': { multiplier: 0, essential: false }
            }
        },
        variable: {
            trigger: (weather) => {
                const temps = weather.map(d => d.temp);
                const range = Math.max(...temps) - Math.min(...temps);
                return range > 10;
            },
            items: {
                'Layering pieces': { 
                    multiplier: 0.4, 
                    essential: true,
                    description: 'For temperature changes'
                },
                'Light jacket': { multiplier: 0, essential: true },
                'Versatile pants': { multiplier: 0.3, essential: true }
            }
        }
    },
    
    temperatureClothing: {
        freezing: {
            trigger: (avgTemp) => avgTemp < 0,
            items: {
                'Heavy winter coat': { multiplier: 0, essential: true },
                'Thermal underwear': { multiplier: 0.6, essential: true },
                'Heavy sweaters': { multiplier: 0.4, essential: true },
                'Insulated boots': { multiplier: 0, essential: true }
            }
        },
        cold: {
            trigger: (avgTemp) => avgTemp >= 0 && avgTemp < 10,
            items: {
                'Medium weight jacket': { multiplier: 0, essential: true },
                'Sweaters': { multiplier: 0.4, essential: true },
                'Long pants': { multiplier: 0.6, essential: true },
                'Closed shoes': { multiplier: 0.2, essential: true }
            }
        },
        mild: {
            trigger: (avgTemp) => avgTemp >= 10 && avgTemp <= 20,
            items: {
                'Light jacket': { multiplier: 0, essential: false },
                'Long sleeve shirts': { multiplier: 0.5, essential: true },
                'Pants and shorts mix': { multiplier: 0.4, essential: true }
            }
        },
        warm: {
            trigger: (avgTemp) => avgTemp > 20 && avgTemp <= 30,
            items: {
                'Light shirts': { multiplier: 0.8, essential: true },
                'Shorts': { multiplier: 0.6, essential: true },
                'Light pants': { multiplier: 0.3, essential: false },
                'Breathable shoes': { multiplier: 0, essential: true }
            }
        },
        hot: {
            trigger: (avgTemp) => avgTemp > 30,
            items: {
                'Ultra-light clothing': { multiplier: 1, essential: true },
                'Shorts only': { multiplier: 0.8, essential: true },
                'Sandals': { multiplier: 0, essential: true },
                'Cooling accessories': { multiplier: 0, essential: false }
            }
        }
    },
    
    activities: {
        business: {
            category: 'business_items',
            items: {
                'Business attire': { multiplier: 0.4, essential: true, min: 2 },
                'Dress shoes': { multiplier: 0, essential: true },
                'Laptop & accessories': { multiplier: 0, essential: true },
                'Business cards': { multiplier: 0, essential: true },
                'Professional bag': { multiplier: 0, essential: true }
            }
        },
        sightseeing: {
            category: 'activity_items',
            items: {
                'Comfortable walking shoes': { multiplier: 0.2, essential: true },
                'Day backpack': { multiplier: 0, essential: true },
                'Guidebook/maps': { multiplier: 0, essential: false },
                'Portable charger': { multiplier: 0, essential: true },
                'Camera': { multiplier: 0, essential: false }
            }
        },
        hiking: {
            category: 'hiking_gear',
            items: {
                'Hiking boots': { multiplier: 0, essential: true },
                'Hiking backpack': { multiplier: 0, essential: true },
                'Quick-dry clothing': { multiplier: 0.6, essential: true },
                'First aid kit': { multiplier: 0, essential: true },
                'Trail maps/GPS': { multiplier: 0, essential: true },
                'Water bottles': { multiplier: 0.2, essential: true }
            }
        },
        beach: {
            category: 'beach_gear',
            items: {
                'Swimwear': { multiplier: 0.4, essential: true, min: 2 },
                'Beach towel': { multiplier: 0, essential: true },
                'Flip flops': { multiplier: 0, essential: true },
                'Beach bag': { multiplier: 0, essential: false },
                'Waterproof phone case': { multiplier: 0, essential: false }
            }
        },
        photography: {
            category: 'photography_gear',
            items: {
                'Camera equipment': { multiplier: 0, essential: true },
                'Extra batteries': { multiplier: 0.3, essential: true },
                'Memory cards': { multiplier: 0.3, essential: true },
                'Lens cleaning kit': { multiplier: 0, essential: true },
                'Camera bag': { multiplier: 0, essential: true }
            }
        },
        workout: {
            category: 'fitness_gear',
            items: {
                'Workout clothes': { multiplier: 0.4, essential: true },
                'Athletic shoes': { multiplier: 0, essential: true },
                'Sports accessories': { multiplier: 0, essential: false },
                'Gym towel': { multiplier: 0.2, essential: false }
            }
        }
    },
    
    tripTypes: {
        business: {
            items: {
                business_items: {
                    'Professional wardrobe': { multiplier: 0.5, essential: true },
                    'Work electronics': { multiplier: 0, essential: true },
                    'Office supplies': { multiplier: 0, essential: true }
                }
            }
        },
        camping: {
            items: {
                camping_gear: {
                    'Tent': { multiplier: 0, essential: true },
                    'Sleeping bag': { multiplier: 0, essential: true },
                    'Camping stove': { multiplier: 0, essential: true },
                    'Camping utensils': { multiplier: 0, essential: true },
                    'Headlamp': { multiplier: 0, essential: true }
                }
            }
        },
        'winter-sports': {
            items: {
                winter_sports_gear: {
                    'Ski/snowboard wear': { multiplier: 0, essential: true },
                    'Thermal layers': { multiplier: 0.8, essential: true },
                    'Winter sports accessories': { multiplier: 0, essential: true }
                }
            }
        }
    },
    
    duration: {
        weekend: {
            trigger: (nights) => nights <= 3,
            items: {
                'Travel-size toiletries': { multiplier: 0, essential: true },
                'Minimal clothing': { multiplier: 0, essential: false }
            }
        },
        week: {
            trigger: (nights) => nights > 3 && nights <= 7,
            items: {
                'Laundry detergent pods': { multiplier: 0, essential: false },
                'Extra toiletries': { multiplier: 0, essential: false }
            }
        },
        extended: {
            trigger: (nights) => nights > 7,
            items: {
                'Laundry supplies': { multiplier: 0, essential: true },
                'Extra toiletries': { multiplier: 0, essential: true },
                'Backup chargers': { multiplier: 0, essential: true },
                'Sewing kit': { multiplier: 0, essential: false }
            }
        }
    },
    
    replacements: [
        {
            replacingItems: ['Light shirts', 'Shorts'],
            replacedItems: ['Heavy sweaters', 'Thermal underwear', 'Winter clothing']
        },
        {
            replacingItems: ['Warm jacket', 'Thermal layers'],
            replacedItems: ['Tank tops', 'Light summer clothes']
        },
        {
            replacingItems: ['Business attire'],
            replacedItems: ['Casual-only clothing']
        },
        {
            replacingItems: ['Hiking boots'],
            replacedItems: ['Dress shoes only']
        }
    ]
};
