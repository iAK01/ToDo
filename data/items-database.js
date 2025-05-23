// Items database - master list of all possible packing items
export const itemsDatabase = {
    essentials: {
        clothes: {
            icon: '👔',
            items: {
                'Underwear': { 
                    multiplier: 1.2, 
                    essential: true,
                    min: 3,
                    description: 'Pack extras for comfort'
                },
                'Socks': { 
                    multiplier: 1.2, 
                    essential: true,
                    min: 3,
                    description: 'Mix of regular and athletic'
                },
                'Sleep bottoms': { 
                    multiplier: 0.4, 
                    essential: true, 
                    min: 2,
                    description: 'Pajama pants or shorts'
                },
                'Sleep tops': { 
                    multiplier: 0.4, 
                    essential: true, 
                    min: 2,
                    description: 'Comfortable sleeping shirts'
                },
                'Basic t-shirts': { 
                    multiplier: 0.8, 
                    essential: true,
                    min: 2,
                    description: 'Versatile everyday wear'
                },
                'Pants/jeans': { 
                    multiplier: 0.4, 
                    essential: true, 
                    min: 2,
                    max: 4,
                    description: 'Everyday bottoms'
                },
                'Casual shirts': {
                    multiplier: 0.6,
                    essential: true,
                    min: 2,
                    description: 'For dining and activities'
                }
            }
        },
        toiletries: {
            icon: '🧴',
            items: {
                'Toothbrush & toothpaste': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Travel-sized preferred'
                },
                'Shampoo & conditioner': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Travel bottles or hotel provided'
                },
                'Body wash/soap': { 
                    multiplier: 0, 
                    essential: true 
                },
                'Deodorant': { 
                    multiplier: 0, 
                    essential: true 
                },
                'Medications': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Prescription and basic meds'
                },
                'Razor & shaving cream': {
                    multiplier: 0,
                    essential: false,
                    description: 'If needed'
                },
                'Skincare items': {
                    multiplier: 0,
                    essential: false,
                    description: 'Moisturizer, sunscreen'
                }
            }
        },
        electronics: {
            icon: '💻',
            items: {
                'Phone charger': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Consider backup cables also'
                },
                'Universal adapter': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'For international travel non UK! EU? US?'
                },
                'Power bank': { 
                    multiplier: 0, 
                    essential: true,
                    description: '10000mAh+ recommended'
                },
                'Headphones': {
                    multiplier: 0,
                    essential: false,
                    description: 'For flights and downtime, bearing in mind the Anker for multiple connections and noise cancelling'
                }
            }
        },
        documents: {
            icon: '📄',
            items: {
                'Passport/ID': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Check expiration date'
                },
                'Travel insurance': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Print copy + digital'
                },
                'Flight/transport tickets': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Print backups and download to Apple Wallet'
                },
                'Hotel confirmations': {
                    multiplier: 0,
                    essential: true,
                    description: 'Address and booking info'
                },
                'Credit/debit cards': { 
                    multiplier: 0, 
                    essential: true,
                    description: 'Notify bank of travel'
                },
                'Cash': {
                    multiplier: 0,
                    essential: true,
                    description: 'Local currency if possible'
                }
            }
        }
    },
    
    seasonal: {
        cold_weather: {
            'Heavy coat': { multiplier: 0, essential: true },
            'Thermal underwear': { multiplier: 0.6, essential: true },
            'Warm gloves': { multiplier: 0.2, essential: true },
            'Winter hat': { multiplier: 0, essential: true },
            'Scarf': { multiplier: 0, essential: false },
            'Warm socks': { multiplier: 0.8, essential: true }
        },
       hot_weather: {
    'Light shirts': { multiplier: 0.8, essential: true },
    'Shorts': { multiplier: 0.6, essential: true },
    'Sandals': { multiplier: 0, essential: true },
    'Sun hat': { multiplier: 0, essential: true },
    'Sunglasses': { multiplier: 0, essential: true },
    'Sunscreen': { multiplier: 0, essential: true }
},
        rainy_weather: {
            'Rain jacket': { multiplier: 0, essential: true },
            'Waterproof shoes': { multiplier: 0, essential: false },
            'Compact umbrella': { multiplier: 0, essential: true },
            'Waterproof bag cover': { multiplier: 0, essential: false }
        }
    },
    
    activities_specific: {
        hiking: {
            'Hiking boots': { multiplier: 0, essential: true },
            'Hiking backpack': { multiplier: 0, essential: true },
            'Water bottles': { multiplier: 0.2, essential: true },
            'Trail snacks': { multiplier: 0.5, essential: true },
            'First aid kit': { multiplier: 0, essential: true },
            'Maps/GPS': { multiplier: 0, essential: true },
            'Rain gear': { multiplier: 0, essential: true },
            'Hiking socks': { multiplier: 0.8, essential: true }
        },
        beach: {
            'Swimsuits': { multiplier: 0.4, essential: true, min: 2 },
            'Beach towels': { multiplier: 0.2, essential: true },
            'Flip flops': { multiplier: 0, essential: true },
            'Beach bag': { multiplier: 0, essential: false },
            'Snorkeling gear': { multiplier: 0, essential: false },
            'Water shoes': { multiplier: 0, essential: false },
            'Rash guard': { multiplier: 0, essential: false }
        },
        business: {
            'Business suits': { multiplier: 0.3, essential: true, min: 2 },
            'Dress shirts': { multiplier: 0.5, essential: true, min: 3 },
            'Dress shoes': { multiplier: 0, essential: true },
            'Ties': { multiplier: 0.3, essential: false },
            'Blazer': { multiplier: 0, essential: true },
            'Laptop': { multiplier: 0, essential: true },
            'Business cards': { multiplier: 0, essential: true },
            'Portfolio/briefcase': { multiplier: 0, essential: false }
        },
        photography: {
            'Camera body': { multiplier: 0, essential: true },
            'Camera lenses': { multiplier: 0, essential: true },
            'Memory cards': { multiplier: 0.3, essential: true },
            'Camera batteries': { multiplier: 0.2, essential: true },
            'Tripod': { multiplier: 0, essential: false },
            'Camera bag': { multiplier: 0, essential: true },
            'Lens cleaning kit': { multiplier: 0, essential: true },
            'ND filters': { multiplier: 0, essential: false }
        },
        fitness: {
            'Workout clothes': { multiplier: 0.5, essential: true },
            'Sports shoes': { multiplier: 0, essential: true },
            'Gym towel': { multiplier: 0.2, essential: false },
            'Water bottle': { multiplier: 0, essential: true },
            'Resistance bands': { multiplier: 0, essential: false },
            'Sports headphones': { multiplier: 0, essential: false }
        }
    },
    
    special_items: {
        baby_travel: {
            'Diapers': { multiplier: 6, essential: true },
            'Baby wipes': { multiplier: 2, essential: true },
            'Baby clothes': { multiplier: 2, essential: true },
            'Formula/food': { multiplier: 3, essential: true },
            'Bottles': { multiplier: 0.5, essential: true },
            'Pacifiers': { multiplier: 0.3, essential: true },
            'Baby carrier': { multiplier: 0, essential: true },
            'Stroller': { multiplier: 0, essential: false }
        },
        medical_needs: {
            'Prescription medications': { multiplier: 0, essential: true },
            'Medical devices': { multiplier: 0, essential: true },
            'Emergency contacts': { multiplier: 0, essential: true },
            'Insurance cards': { multiplier: 0, essential: true },
            'Allergy medications': { multiplier: 0, essential: false },
            'Massager': { multiplier: 0, essential: false }
        },
        tech_nomad: {
            'Laptop': { multiplier: 0, essential: true },
            'Laptop charger': { multiplier: 0, essential: true },
            'Mouse': { multiplier: 0, essential: false },
            'Portable monitor': { multiplier: 0, essential: false },
            'USB hub': { multiplier: 0, essential: false },
            'Ethernet cable': { multiplier: 0, essential: false },
            'Backup drive': { multiplier: 0, essential: false }
        }
    }
};
