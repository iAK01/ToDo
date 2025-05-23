// List Generator - handles the logic for generating packing lists
import { itemsDatabase } from '../data/items-database.js';
import { conditionalRules } from '../data/conditional-rules.js';

export class ListGenerator {
    constructor() {
        this.itemsDB = itemsDatabase;
        this.rules = conditionalRules;
    }

    async generateItems(tripData) {
        const items = {};
        
        // Step 1: Add essential base items
        this.addEssentialItems(items, tripData);
        
        // Step 2: Calculate average temperature if weather data exists
        const avgTemp = this.calculateAverageTemperature(tripData.weather);
        
        // Step 3: Add temperature-appropriate clothing
        this.addTemperatureClothing(items, avgTemp, tripData.nights);
        
        // Step 4: Add conditional items based on various factors
        this.addConditionalItems(items, tripData);
        
        // Step 5: Remove replaced items
        this.removeReplacedItems(items);
        
        // Step 6: Adjust quantities based on trip duration
        this.adjustQuantities(items, tripData.nights);
        
        return items;
    }

    addEssentialItems(items, tripData) {
        for (const [categoryKey, category] of Object.entries(this.itemsDB.essentials)) {
            items[categoryKey] = {};
            
            for (const [itemName, itemData] of Object.entries(category.items)) {
                // Skip items not relevant to trip type
                if (itemData.excludeForTripTypes && 
                    itemData.excludeForTripTypes.includes(tripData.tripType)) {
                    continue;
                }
                
                items[categoryKey][itemName] = {
                    quantity: this.calculateQuantity(itemData, tripData.nights),
                    essential: itemData.essential,
                    completed: false,
                    notes: itemData.description || ''
                };
            }
        }
    }

    calculateQuantity(itemData, nights) {
        if (itemData.multiplier === 0) return 1;
        
        let quantity = Math.ceil(nights * itemData.multiplier);
        
        // Apply minimum if specified
        if (itemData.min && quantity < itemData.min) {
            quantity = itemData.min;
        }
        
        // Apply maximum if specified
        if (itemData.max && quantity > itemData.max) {
            quantity = itemData.max;
        }
        
        // Cap at reasonable maximum
        if (!itemData.max && quantity > nights + 2) {
            quantity = nights + 2;
        }
        
        return Math.max(1, quantity);
    }

    calculateAverageTemperature(weather) {
        if (!weather || weather.length === 0) return 20; // Default temp
        
        const temps = weather.map(day => day.temp);
        return Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length);
    }

    addTemperatureClothing(items, avgTemp, nights) {
        for (const [tempRange, config] of Object.entries(this.rules.temperatureClothing)) {
            if (config.trigger(avgTemp)) {
                if (!items.clothes) {
                    items.clothes = {};
                }
                
                for (const [itemName, itemData] of Object.entries(config.items)) {
                    const quantity = this.calculateQuantity(itemData, nights);
                    
                    items.clothes[itemName] = {
                        quantity: quantity,
                        essential: itemData.essential,
                        completed: false,
                        notes: `Added for ${tempRange} weather (${avgTemp}°C avg)`
                    };
                }
            }
        }
    }

    addConditionalItems(items, tripData) {
        // Weather-based items
        if (tripData.weather) {
            for (const [condition, config] of Object.entries(this.rules.weather)) {
                if (config.trigger(tripData.weather)) {
                    this.addItemsToCategory(
                        items, 
                        'weather_gear', 
                        config.items, 
                        `${condition} weather`,
                        tripData.nights
                    );
                }
            }
        }
        
        // Activity-based items
        if (tripData.activities) {
            for (const activity of tripData.activities) {
                const config = this.rules.activities[activity];
                if (config) {
                    const categoryName = config.category || `${activity}_gear`;
                    this.addItemsToCategory(
                        items,
                        categoryName,
                        config.items,
                        `${activity} activities`,
                        tripData.nights
                    );
                }
            }
        }
        
        // Trip type specific items
        const tripTypeConfig = this.rules.tripTypes[tripData.tripType];
        if (tripTypeConfig) {
            for (const [categoryName, categoryItems] of Object.entries(tripTypeConfig.items)) {
                this.addItemsToCategory(
                    items,
                    categoryName,
                    categoryItems,
                    `${tripData.tripType} trip`,
                    tripData.nights
                );
            }
        }
        
        // Duration-based items
        for (const [duration, config] of Object.entries(this.rules.duration)) {
            if (config.trigger(tripData.nights)) {
                this.addItemsToCategory(
                    items,
                    'travel_essentials',
                    config.items,
                    `${duration} trip`,
                    tripData.nights
                );
            }
        }
        
        // Notes-based items (parse special keywords from notes)
        if (tripData.notes) {
            this.parseNotesForItems(items, tripData.notes, tripData.nights);
        }
    }

    addItemsToCategory(items, categoryKey, categoryItems, reason, nights) {
        if (!items[categoryKey]) {
            items[categoryKey] = {};
        }
        
        for (const [itemName, itemData] of Object.entries(categoryItems)) {
            const quantity = this.calculateQuantity(itemData, nights);
            
            items[categoryKey][itemName] = {
                quantity: quantity,
                essential: itemData.essential,
                completed: false,
                notes: itemData.description ? 
                    `${itemData.description} (${reason})` : 
                    `Added for ${reason}`
            };
        }
    }

    parseNotesForItems(items, notes, nights) {
        const notesLower = notes.toLowerCase();
        
        // Check for special keywords
        const keywords = {
            'formal': {
                category: 'formal_wear',
                items: {
                    'Formal suit/dress': { multiplier: 0, essential: true },
                    'Dress shoes': { multiplier: 0, essential: true },
                    'Formal accessories': { multiplier: 0, essential: false }
                }
            },
            'wedding': {
                category: 'formal_wear',
                items: {
                    'Wedding outfit': { multiplier: 0, essential: true },
                    'Dress shoes': { multiplier: 0, essential: true },
                    'Gift/Card': { multiplier: 0, essential: true }
                }
            },
            'conference': {
                category: 'business_items',
                items: {
                    'Name badge holder': { multiplier: 0, essential: true },
                    'Extra business cards': { multiplier: 0, essential: true },
                    'Conference materials': { multiplier: 0, essential: false }
                }
            },
            'baby': {
                category: 'baby_items',
                items: {
                    'Baby clothes': { multiplier: 1.5, essential: true },
                    'Diapers': { multiplier: 6, essential: true },
                    'Baby food/formula': { multiplier: 3, essential: true },
                    'Baby carrier': { multiplier: 0, essential: true }
                }
            }
        };
        
        for (const [keyword, config] of Object.entries(keywords)) {
            if (notesLower.includes(keyword)) {
                this.addItemsToCategory(
                    items,
                    config.category,
                    config.items,
                    `${keyword} mentioned in notes`,
                    nights
                );
            }
        }
    }

    removeReplacedItems(items) {
        const itemsToRemove = [];
        
        // Check replacement rules
        for (const rule of this.rules.replacements) {
            let shouldReplace = false;
            
            // Check if replacing items exist
            for (const replacingItem of rule.replacingItems) {
                for (const category of Object.values(items)) {
                    if (category[replacingItem]) {
                        shouldReplace = true;
                        break;
                    }
                }
            }
            
            // Remove replaced items
            if (shouldReplace) {
                for (const [categoryKey, categoryItems] of Object.entries(items)) {
                    for (const itemName of Object.keys(categoryItems)) {
                        if (rule.replacedItems.some(replaced => 
                            itemName.toLowerCase().includes(replaced.toLowerCase())
                        )) {
                            itemsToRemove.push({ category: categoryKey, item: itemName });
                        }
                    }
                }
            }
        }
        
        // Remove the items
        itemsToRemove.forEach(({ category, item }) => {
            delete items[category][item];
        });
        
        // Clean up empty categories
        for (const [categoryKey, categoryItems] of Object.entries(items)) {
            if (Object.keys(categoryItems).length === 0) {
                delete items[categoryKey];
            }
        }
    }

    adjustQuantities(items, nights) {
        // Adjust quantities for very short or very long trips
        const adjustmentFactor = nights <= 2 ? 0.8 : nights >= 14 ? 1.2 : 1;
        
        for (const categoryItems of Object.values(items)) {
            for (const item of Object.values(categoryItems)) {
                if (item.quantity > 1) {
                    item.quantity = Math.ceil(item.quantity * adjustmentFactor);
                }
            }
        }
    }

    async exportToText(tripData) {
        let exportText = `🧳 PACKING LIST - ${tripData.location}\n`;
        exportText += `📅 ${tripData.startDate} | ${tripData.nights} nights | ${tripData.tripType}\n\n`;
        
        if (tripData.notes) {
            exportText += `📝 Notes: ${tripData.notes}\n\n`;
        }
        
        // Weather section
        if (tripData.weather && tripData.weather.length > 0) {
            exportText += `🌤️ WEATHER FORECAST:\n`;
            tripData.weather.forEach(day => {
                exportText += `• ${day.date}: ${day.condition}, ${day.temp}°C`;
                if (day.chanceOfRain > 30) {
                    exportText += ` (${day.chanceOfRain}% rain)`;
                }
                exportText += '\n';
            });
            exportText += '\n';
        }
        
        // Progress
        let totalItems = 0;
        let completedItems = 0;
        for (const items of Object.values(tripData.items)) {
            totalItems += Object.keys(items).length;
            completedItems += Object.values(items).filter(item => item.completed).length;
        }
        
        const percentage = totalItems > 0 ? Math.round((completedItems/totalItems)*100) : 0;
        exportText += `📊 PROGRESS: ${completedItems}/${totalItems} items (${percentage}%)\n\n`;
        
        // Categories
        const categoryNames = {
            clothes: '👔 CLOTHES',
            toiletries: '🧴 TOILETRIES',
            electronics: '💻 ELECTRONICS',
            documents: '📄 DOCUMENTS',
            weather_gear: '☔ WEATHER GEAR',
            business_items: '💼 BUSINESS ITEMS',
            formal_wear: '👔 FORMAL WEAR',
            hiking_gear: '🥾 HIKING GEAR',
            beach_gear: '🏖️ BEACH GEAR',
            photography_gear: '📸 PHOTOGRAPHY',
            fitness_gear: '💪 FITNESS',
            activity_items: '🎯 ACTIVITY ITEMS',
            travel_essentials: '✈️ TRAVEL ESSENTIALS',
            baby_items: '👶 BABY ITEMS'
        };
        
        for (const [categoryKey, items] of Object.entries(tripData.items)) {
            if (Object.keys(items).length === 0) continue;
            
            exportText += `${categoryNames[categoryKey] || categoryKey.toUpperCase()}:\n`;
            
            for (const [itemName, itemData] of Object.entries(items)) {
                const checkbox = itemData.completed ? '☑' : '☐';
                const quantity = itemData.quantity > 1 ? ` (×${itemData.quantity})` : '';
                const essential = itemData.essential ? ' *' : '';
                const notes = itemData.notes ? ` - ${itemData.notes}` : '';
                
                exportText += `${checkbox} ${itemName}${quantity}${essential}${notes}\n`;
            }
            exportText += '\n';
        }
        
        exportText += '* = Essential items\n';
        exportText += `Generated by Smart Trip Planner - ${new Date().toLocaleString()}`;
        
        return exportText;
    }
}
