// Checklist Display Component - renders and manages the packing list
export class ChecklistDisplay {
    constructor(options) {
        this.container = options.container;
        this.onItemToggle = options.onItemToggle;
        this.onItemAdd = options.onItemAdd;
        this.onNoteUpdate = options.onNoteUpdate;
        
        this.categoryNames = {
            clothes: '👔 Clothes',
            toiletries: '🧴 Toiletries',
            electronics: '💻 Electronics',
            documents: '📄 Documents',
            weather_gear: '☔ Weather Gear',
            business_items: '💼 Business Items',
            hiking_gear: '🥾 Hiking Gear',
            beach_gear: '🏖️ Beach Gear',
            photography_gear: '📸 Photography',
            fitness_gear: '💪 Fitness',
            activity_items: '🎯 Activity Items',
            travel_essentials: '✈️ Travel Essentials'
        };
        
        this.categoryIcons = {
            clothes: '👔',
            toiletries: '🧴',
            electronics: '💻',
            documents: '📄',
            weather_gear: '☔',
            business_items: '💼',
            hiking_gear: '🥾',
            beach_gear: '🏖️',
            photography_gear: '📸',
            fitness_gear: '💪',
            activity_items: '🎯',
            travel_essentials: '✈️'
        };
    }

    render(items, tripData = null) {
        this.container.innerHTML = '';
        
        // Add trip summary if provided
        if (tripData) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'trip-summary';
            summaryDiv.innerHTML = this.generateTripSummary(tripData);
            this.container.appendChild(summaryDiv);
        }
        
        // Render each category
        for (const [categoryKey, categoryItems] of Object.entries(items)) {
            if (Object.keys(categoryItems).length === 0) continue;
            
            const categoryElement = this.createCategoryElement(categoryKey, categoryItems);
            this.container.appendChild(categoryElement);
        }
        
        // Bind events after rendering
        this.bindCategoryEvents();
    }

    generateTripSummary(tripData) {
        const avgTemp = tripData.weather ? 
            Math.round(tripData.weather.reduce((sum, day) => sum + day.temp, 0) / tripData.weather.length) : 'Unknown';
        
        const conditions = [];
        
        // Weather conditions
        if (tripData.weather) {
            const hasRain = tripData.weather.some(day => day.condition.toLowerCase().includes('rain'));
            const hasCold = tripData.weather.some(day => day.temp < 10);
            const hasHot = tripData.weather.some(day => day.temp > 25);
            
            if (hasRain) conditions.push('🌧️ Rain gear included');
            if (hasCold) conditions.push('🧥 Cold weather gear included');
            if (hasHot) conditions.push('☀️ Hot weather items included');
        }
        
        // Activity conditions
        if (tripData.activities && tripData.activities.length > 0) {
            conditions.push(`🎯 Added items for: ${tripData.activities.join(', ')}`);
        }
        
        return `
            <h4>📋 Smart Packing Summary</h4>
            <p><strong>Trip:</strong> ${tripData.location} • ${tripData.nights} nights • ${tripData.tripType}</p>
            <p><strong>Average Temperature:</strong> ${avgTemp}°C</p>
            ${conditions.length > 0 ? `<div style="margin-top: 10px;">${conditions.map(c => `<div>${c}</div>`).join('')}</div>` : ''}
            <p style="margin-top: 10px; font-size: 0.9em; color: rgba(255,255,255,0.8);">
                ✨ This list was automatically customized based on your destination, weather, and activities!
            </p>
        `;
    }

    createCategoryElement(categoryKey, items) {
        const totalItems = Object.keys(items).length;
        const completedItems = Object.values(items).filter(item => item.completed).length;
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.setAttribute('data-category', categoryKey);
        
        categoryDiv.innerHTML = `
            <div class="category-header" data-category-toggle="${categoryKey}">
                <div class="category-title">
                    <span>${this.categoryIcons[categoryKey] || '📦'}</span>
                    <span>${this.categoryNames[categoryKey] || categoryKey.replace('_', ' ')}</span>
                </div>
                <div class="category-progress">
                    <div class="category-badge">${completedItems}/${totalItems}</div>
                    <div class="category-badge">${percentage}%</div>
                    <span class="toggle-icon">▼</span>
                </div>
            </div>
            <div class="category-content" id="category-${categoryKey}">
                ${Object.entries(items).map(([itemName, itemData]) => 
                    this.createItemElement(categoryKey, itemName, itemData)
                ).join('')}
                <div class="add-item-section">
                    <div class="add-item-form">
                        <input type="text" placeholder="Add custom item..." id="new-item-${categoryKey}">
                        <input type="number" placeholder="Qty" min="1" value="1" id="new-qty-${categoryKey}">
                        <button class="btn btn-primary" data-add-item="${categoryKey}">Add</button>
                    </div>
                </div>
            </div>
        `;
        
        return categoryDiv;
    }

    createItemElement(categoryKey, itemName, itemData) {
        const itemId = `${categoryKey}-${itemName.replace(/[^a-zA-Z0-9]/g, '')}`;
        return `
            <div class="item ${itemData.completed ? 'completed' : ''}" id="item-${itemId}">
                <input type="checkbox" 
                       class="item-checkbox" 
                       data-category="${categoryKey}"
                       data-item="${itemName}"
                       ${itemData.completed ? 'checked' : ''}>
                <div class="item-content">
                    <div class="item-header">
                        <div class="item-name">
                            ${itemName}
                            ${itemData.essential ? '<span class="item-essential">*</span>' : ''}
                        </div>
                        ${itemData.quantity > 1 ? `<div class="item-quantity">×${itemData.quantity}</div>` : ''}
                    </div>
                    <textarea class="item-notes" 
                              placeholder="Add notes..." 
                              data-category="${categoryKey}"
                              data-item="${itemName}">${itemData.notes || ''}</textarea>
                </div>
            </div>
        `;
    }

    bindCategoryEvents() {
        // Category toggle handlers
        document.querySelectorAll('[data-category-toggle]').forEach(header => {
            header.addEventListener('click', (e) => {
                const categoryKey = header.getAttribute('data-category-toggle');
                this.toggleCategory(categoryKey);
            });
        });

        // Item checkbox handlers
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = e.target.getAttribute('data-category');
                const item = e.target.getAttribute('data-item');
                this.onItemToggle(category, item);
            });
        });

        // Add item button handlers
        document.querySelectorAll('[data-add-item]').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.getAttribute('data-add-item');
                this.handleAddItem(category);
            });
        });

        // Note update handlers
        document.querySelectorAll('.item-notes').forEach(textarea => {
            textarea.addEventListener('change', (e) => {
                const category = e.target.getAttribute('data-category');
                const item = e.target.getAttribute('data-item');
                this.onNoteUpdate(category, item, e.target.value);
            });
        });

        // Enter key on add item inputs
        document.querySelectorAll('[id^="new-item-"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const category = input.id.replace('new-item-', '');
                    this.handleAddItem(category);
                }
            });
        });
    }

    toggleCategory(categoryKey) {
        const content = document.getElementById(`category-${categoryKey}`);
        const category = content.parentElement;
        
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            category.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
            category.classList.add('expanded');
        }
    }

    handleAddItem(categoryKey) {
        const nameInput = document.getElementById(`new-item-${categoryKey}`);
        const qtyInput = document.getElementById(`new-qty-${categoryKey}`);
        
        const itemName = nameInput.value.trim();
        const quantity = parseInt(qtyInput.value) || 1;
        
        if (!itemName) {
            alert('Please enter an item name');
            return;
        }
        
        // Clear inputs
        nameInput.value = '';
        qtyInput.value = '1';
        
        // Call parent handler
        this.onItemAdd(categoryKey, itemName, quantity);
    }

    updateItem(categoryKey, itemName, itemData) {
        const itemId = `${categoryKey}-${itemName.replace(/[^a-zA-Z0-9]/g, '')}`;
        const itemElement = document.getElementById(`item-${itemId}`);
        
        if (itemElement) {
            if (itemData.completed) {
                itemElement.classList.add('completed');
            } else {
                itemElement.classList.remove('completed');
            }
            
            // Update checkbox
            const checkbox = itemElement.querySelector('.item-checkbox');
            if (checkbox) {
                checkbox.checked = itemData.completed;
            }
        }
        
        // Update category progress
        this.updateCategoryProgress(categoryKey);
    }

    updateCategoryProgress(categoryKey) {
        const categoryElement = document.querySelector(`[data-category="${categoryKey}"]`);
        if (!categoryElement) return;
        
        // Count items
        const items = categoryElement.querySelectorAll('.item');
        const completedItems = categoryElement.querySelectorAll('.item.completed');
        const totalItems = items.length - 1; // Subtract 1 for the add item section
        const completed = completedItems.length;
        const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
        
        // Update badges
        const badges = categoryElement.querySelectorAll('.category-badge');
        if (badges.length >= 2) {
            badges[0].textContent = `${completed}/${totalItems}`;
            badges[1].textContent = `${percentage}%`;
        }
    }
}
