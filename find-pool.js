document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('travel-date').value = formattedDate;

    // Toggle Filters
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const filtersContent = document.querySelector('.filters-content');

    toggleFiltersBtn.addEventListener('click', function() {
        filtersContent.classList.toggle('active');
        this.classList.toggle('active');
        
        const text = this.querySelector('span');
        if (filtersContent.classList.contains('active')) {
            text.textContent = 'Hide Filters';
        } else {
            text.textContent = 'Show Filters';
        }
    });

    // Price Range Slider
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    priceRange.addEventListener('input', function() {
        priceValue.textContent = `₹${this.value}`;
        
        // Update slider background
        const percentage = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
    });

    // Current Location
    const currentLocationBtn = document.getElementById('current-location');
    
    currentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            currentLocationBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 18L12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 12L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            currentLocationBtn.classList.add('loading');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, we would use reverse geocoding to get the address
                    // For demo purposes, we'll just show coordinates
                    const lat = position.coords.latitude.toFixed(4);
                    const lng = position.coords.longitude.toFixed(4);
                    document.getElementById('pickup-location').value = `Current Location (${lat}, ${lng})`;
                    
                    currentLocationBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    currentLocationBtn.classList.remove('loading');
                },
                function(error) {
                    alert('Unable to retrieve your location. Please enter manually.');
                    currentLocationBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    currentLocationBtn.classList.remove('loading');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });

    // Search Form Submission
    const searchForm = document.getElementById('search-form');
    const resultsSection = document.getElementById('results-section');
    const listView = document.getElementById('list-view');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const pickupLocation = document.getElementById('pickup-location').value;
        const dropLocation = document.getElementById('drop-location').value;
        
        if (!pickupLocation || !dropLocation) {
            alert('Please enter both pickup and drop locations');
            return;
        }
        
        // Show loading state
        const searchButton = this.querySelector('.search-button');
        const originalButtonText = searchButton.innerHTML;
        searchButton.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="60">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
            Searching...
        `;
        
        // Simulate API call with timeout
        setTimeout(function() {
            // Update progress timeline
            const progressSteps = document.querySelectorAll('.progress-step');
            progressSteps[0].classList.add('completed');
            progressSteps[1].classList.add('active');
            
            // Show results section
            resultsSection.classList.remove('hidden');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Generate pool cards
            generatePoolCards();
            
            // Reset search button
            searchButton.innerHTML = originalButtonText;
        }, 1500);
    });

    // View Toggle
    const listViewBtn = document.getElementById('list-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const mapView = document.getElementById('map-view');
    
    listViewBtn.addEventListener('click', function() {
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
        listView.classList.remove('hidden');
        mapView.classList.add('hidden');
    });
    
    mapViewBtn.addEventListener('click', function() {
        mapViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        mapView.classList.remove('hidden');
        listView.classList.add('hidden');
    });

    // Map Pins Click Event
    const mapPins = document.querySelectorAll('.map-pin');
    const mapListView = document.getElementById('map-list-view');
    
    mapPins.forEach(pin => {
        pin.addEventListener('click', function() {
            const poolId = this.getAttribute('data-id');
            const poolData = getPoolData(poolId);
            
            // Highlight active pin
            mapPins.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            // Show pool details in map list view
            mapListView.innerHTML = generatePoolCard(poolData);
            
            // Add event listeners to the newly created card
            addPoolCardEventListeners();
        });
    });

    // Pool Details Modal
    const modal = document.getElementById('pool-details-modal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    closeModalBtn.addEventListener('click', closeModal);
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Generate Pool Cards
    function generatePoolCards() {
        listView.innerHTML = '';
        
        // Sample pool data
        const pools = [
            {
                id: 'pool-1',
                driver: {
                    name: 'Rahul Singh',
                    rating: 4.8,
                    verified: true,
                    avatar: 'RS'
                },
                route: {
                    pickup: 'Indiranagar, Bangalore',
                    drop: 'Electronic City, Bangalore',
                    date: '26 Apr, 2023',
                    time: '09:30 AM',
                    distance: '18 km',
                    duration: '45 min'
                },
                vehicle: {
                    model: 'Honda City',
                    color: 'White',
                    number: 'KA 01 AB 1234',
                    features: ['AC', '4 Seats', 'Music System']
                },
                seats: {
                    available: 3,
                    total: 4
                },
                price: 180,
                features: ['Ladies Only', 'AC']
            },
            {
                id: 'pool-2',
                driver: {
                    name: 'Priya Sharma',
                    rating: 4.9,
                    verified: true,
                    avatar: 'PS'
                },
                route: {
                    pickup: 'Koramangala, Bangalore',
                    drop: 'Whitefield, Bangalore',
                    date: '26 Apr, 2023',
                    time: '10:00 AM',
                    distance: '15 km',
                    duration: '40 min'
                },
                vehicle: {
                    model: 'Maruti Swift',
                    color: 'Silver',
                    number: 'KA 05 CD 5678',
                    features: ['AC', '3 Seats', 'Music System']
                },
                seats: {
                    available: 2,
                    total: 3
                },
                price: 150,
                features: ['AC']
            },
            {
                id: 'pool-3',
                driver: {
                    name: 'Amit Kumar',
                    rating: 4.7,
                    verified: false,
                    avatar: 'AK'
                },
                route: {
                    pickup: 'HSR Layout, Bangalore',
                    drop: 'Marathahalli, Bangalore',
                    date: '26 Apr, 2023',
                    time: '11:30 AM',
                    distance: '10 km',
                    duration: '30 min'
                },
                vehicle: {
                    model: 'Hyundai i20',
                    color: 'Blue',
                    number: 'KA 03 EF 9012',
                    features: ['AC', '3 Seats']
                },
                seats: {
                    available: 3,
                    total: 3
                },
                price: 120,
                features: ['AC']
            },
            {
                id: 'pool-4',
                driver: {
                    name: 'Neha Gupta',
                    rating: 4.6,
                    verified: true,
                    avatar: 'NG'
                },
                route: {
                    pickup: 'JP Nagar, Bangalore',
                    drop: 'MG Road, Bangalore',
                    date: '26 Apr, 2023',
                    time: '01:00 PM',
                    distance: '12 km',
                    duration: '35 min'
                },
                vehicle: {
                    model: 'Toyota Etios',
                    color: 'White',
                    number: 'KA 02 GH 3456',
                    features: ['AC', '3 Seats', 'Music System']
                },
                seats: {
                    available: 2,
                    total: 3
                },
                price: 140,
                features: ['Ladies Only', 'AC']
            },
            {
                id: 'pool-5',
                driver: {
                    name: 'Vikram Reddy',
                    rating: 4.5,
                    verified: true,
                    avatar: 'VR'
                },
                route: {
                    pickup: 'Jayanagar, Bangalore',
                    drop: 'Hebbal, Bangalore',
                    date: '26 Apr, 2023',
                    time: '02:30 PM',
                    distance: '20 km',
                    duration: '50 min'
                },
                vehicle: {
                    model: 'Mahindra XUV300',
                    color: 'Black',
                    number: 'KA 04 IJ 7890',
                    features: ['AC', '4 Seats', 'Music System']
                },
                seats: {
                    available: 3,
                    total: 4
                },
                price: 200,
                features: ['AC']
            }
        ];
        
        // Generate cards
        pools.forEach(pool => {
            listView.innerHTML += generatePoolCard(pool);
        });
        
        // Add event listeners to all pool cards
        addPoolCardEventListeners();
    }

    function generatePoolCard(pool) {
        return `
            <div class="pool-card" data-id="${pool.id}">
                <div class="driver-info">
                    <div class="driver-avatar">${pool.driver.avatar}</div>
                    <div class="driver-details">
                        <div class="driver-name">${pool.driver.name}
                            ${pool.driver.verified ? `
                                <span class="verified-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                    Verified
                                </span>
                            ` : ''}
                        </div>
                        <div class="driver-rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#FFD700"/>
                            </svg>
                            ${pool.driver.rating} (${Math.floor(Math.random() * 100) + 50} rides)
                        </div>
                    </div>
                </div>
                <div class="route-info">
                    <div class="route-points">
                        <div class="route-point">
                            <div class="route-point-label">Pickup</div>
                            <div class="route-point-value">${pool.route.pickup}</div>
                        </div>
                        <div class="route-connector">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="route-point">
                            <div class="route-point-label">Drop</div>
                            <div class="route-point-value">${pool.route.drop}</div>
                        </div>
                    </div>
                    <div class="route-details">
                        <div class="route-detail">
                            <div class="route-detail-label">Date</div>
                            <div class="route-detail-value">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                ${pool.route.date}
                            </div>
                        </div>
                        <div class="route-detail">
                            <div class="route-detail-label">Time</div>
                            <div class="route-detail-value">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                ${pool.route.time}
                            </div>
                        </div>
                        <div class="route-detail">
                            <div class="route-detail-label">Seats</div>
                            <div class="route-detail-value">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                ${pool.seats.available}/${pool.seats.total}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pool-card-footer">
                    <div class="price-info">
                        <div class="price-label">Price per person</div>
                        <div class="price-value">₹${pool.price}</div>
                    </div>
                    <button class="view-details-btn">
                        View Details
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    function addPoolCardEventListeners() {
        const poolCards = document.querySelectorAll('.pool-card');
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        
        poolCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.view-details-btn')) {
                    const poolId = this.getAttribute('data-id');
                    const poolData = getPoolData(poolId);
                    showPoolDetails(poolData);
                }
            });
        });
        
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const poolId = this.closest('.pool-card').getAttribute('data-id');
                const poolData = getPoolData(poolId);
                showPoolDetails(poolData);
            });
        });
    }

    function getPoolData(poolId) {
        // In a real app, this would fetch data from an API
        // For demo purposes, we'll use hardcoded data
        const pools = {
            'pool-1': {
                id: 'pool-1',
                driver: {
                    name: 'Rahul Singh',
                    rating: 4.8,
                    verified: true,
                    avatar: 'RS'
                },
                route: {
                    pickup: 'Indiranagar, Bangalore',
                    drop: 'Electronic City, Bangalore',
                    date: '26 Apr, 2023',
                    time: '09:30 AM',
                    distance: '18 km',
                    duration: '45 min'
                },
                vehicle: {
                    model: 'Honda City',
                    color: 'White',
                    number: 'KA 01 AB 1234',
                    features: ['AC', '4 Seats', 'Music System']
                },
                seats: {
                    available: 3,
                    total: 4
                },
                price: 180,
                features: ['Ladies Only', 'AC']
            },
            'pool-2': {
                id: 'pool-2',
                driver: {
                    name: 'Priya Sharma',
                    rating: 4.9,
                    verified: true,
                    avatar: 'PS'
                },
                route: {
                    pickup: 'Koramangala, Bangalore',
                    drop: 'Whitefield, Bangalore',
                    date: '26 Apr, 2023',
                    time: '10:00 AM',
                    distance: '15 km',
                    duration: '40 min'
                },
                vehicle: {
                    model: 'Maruti Swift',
                    color: 'Silver',
                    number: 'KA 05 CD 5678',
                    features: ['AC', '3 Seats', 'Music System']
                },
                seats: {
                    available: 2,
                    total: 3
                },
                price: 150,
                features: ['AC']
            },
            'pool-3': {
                id: 'pool-3',
                driver: {
                    name: 'Amit Kumar',
                    rating: 4.7,
                    verified: false,
                    avatar: 'AK'
                },
                route: {
                    pickup: 'HSR Layout, Bangalore',
                    drop: 'Marathahalli, Bangalore',
                    date: '26 Apr, 2023',
                    time: '11:30 AM',
                    distance: '10 km',
                    duration: '30 min'
                },
                vehicle: {
                    model: 'Hyundai i20',
                    color: 'Blue',
                    number: 'KA 03 EF 9012',
                    features: ['AC', '3 Seats']
                },
                seats: {
                    available: 3,
                    total: 3
                },
                price: 120,
                features: ['AC']
            },
            'pool-4': {
                id: 'pool-4',
                driver: {
                    name: 'Neha Gupta',
                    rating: 4.6,
                    verified: true,
                    avatar: 'NG'
                },
                route: {
                    pickup: 'JP Nagar, Bangalore',
                    drop: 'MG Road, Bangalore',
                    date: '26 Apr, 2023',
                    time: '01:00 PM',
                    distance: '12 km',
                    duration: '35 min'
                },
                vehicle: {
                    model: 'Toyota Etios',
                    color: 'White',
                    number: 'KA 02 GH 3456',
                    features: ['AC', '3 Seats', 'Music System']
                },
                seats: {
                    available: 2,
                    total: 3
                },
                price: 140,
                features: ['Ladies Only', 'AC']
            },
            'pool-5': {
                id: 'pool-5',
                driver: {
                    name: 'Vikram Reddy',
                    rating: 4.5,
                    verified: true,
                    avatar: 'VR'
                },
                route: {
                    pickup: 'Jayanagar, Bangalore',
                    drop: 'Hebbal, Bangalore',
                    date: '26 Apr, 2023',
                    time: '02:30 PM',
                    distance: '20 km',
                    duration: '50 min'
                },
                vehicle: {
                    model: 'Mahindra XUV300',
                    color: 'Black',
                    number: 'KA 04 IJ 7890',
                    features: ['AC', '4 Seats', 'Music System']
                },
                seats: {
                    available: 3,
                    total: 4
                },
                price: 200,
                features: ['AC']
            }
        };

        return pools[poolId];
    }

    function showPoolDetails(poolData) {
        const modal = document.getElementById('pool-details-modal');
        const modalBody = modal.querySelector('.modal-body');

        modalBody.innerHTML = `
            <h4>${poolData.driver.name} (${poolData.driver.rating} ★)</h4>
            <p><strong>Pickup:</strong> ${poolData.route.pickup}</p>
            <p><strong>Drop:</strong> ${poolData.route.drop}</p>
            <p><strong>Vehicle:</strong> ${poolData.vehicle.model} (${poolData.vehicle.color})</p>
            <p><strong>Seats Available:</strong> ${poolData.seats.available}/${poolData.seats.total}</p>
            <p><strong>Price:</strong> ₹${poolData.price}</p>
            <button class="button primary">Book Now</button>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});