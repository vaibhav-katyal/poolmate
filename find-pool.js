document.addEventListener('DOMContentLoaded', function () {
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('travel-date').value = formattedDate;

    // Toggle Filters
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const filtersContent = document.querySelector('.filters-content');
    let fetchedRides = [];  // Global array to store fetched rides

    toggleFiltersBtn.addEventListener('click', function () {
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

    priceRange.addEventListener('input', function () {
        priceValue.textContent = `₹${this.value}`;

        // Update slider background
        const percentage = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
    });

    // Current Location
    const currentLocationBtn = document.getElementById('current-location');

    currentLocationBtn.addEventListener('click', function () {
        if (navigator.geolocation) {
            // Show loading spinner or icon
            currentLocationBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            currentLocationBtn.classList.add('loading');

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude.toFixed(4);
                    const lng = position.coords.longitude.toFixed(4);

                    // Insert current location coordinates into input
                    document.getElementById('pickup-location').value = `Current Location (${lat}, ${lng})`;

                    // Revert button back to original icon
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
                function (error) {
                    alert('Unable to retrieve your location. Please enter manually.');

                    // Revert back to original icon even if failed
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
            alert('Geolocation is not supported by your browser.');
        }
    });


    // Search Form Submission
    const searchForm = document.getElementById("search-form")
    const resultsSection = document.getElementById("results-section")
    const listView = document.getElementById("list-view")
    const noResults = document.getElementById("no-results")

    searchForm.addEventListener("submit", async function (e) {
        e.preventDefault()
    
        const pickupLocation = document.getElementById("pickup-location").value.trim()
        const dropLocation = document.getElementById("drop-location").value.trim()
    
        if (!pickupLocation || !dropLocation) {
            alert("Please enter both pickup and drop locations")
            return
        }
    
        const searchButton = this.querySelector(".search-button")
        const originalButtonText = searchButton.innerHTML
        searchButton.innerHTML = `<svg class="spinner" ... ></svg> Searching...`
    
        try {
            // 👉 Ye fetch karega database se real data
            const response = await fetch(`/api/search-rides?startingPoint=${encodeURIComponent(pickupLocation)}&destinationPoint=${encodeURIComponent(dropLocation)}`)
            const rides = await response.json()
            fetchedRides = rides; // 👈 Save rides globally here
    
            const progressSteps = document.querySelectorAll(".progress-step")
            progressSteps[0].classList.add("completed")
            progressSteps[1].classList.add("active")
    
            resultsSection.classList.remove("hidden")
            document.getElementById("results-count").textContent = rides.length
    
            if (rides.length > 0) {
                listView.innerHTML = ""
                rides.forEach((ride) => {
                    const poolData = {
                        id: ride._id,
                        driver: {
                            name: ride.driverName,
                            rating: 4.7,
                            verified: true,
                            avatar: ride.driverName
                                .split(" ")
                                .map((n) => n[0])
                                .join(""),
                        },
                        route: {
                            pickup: ride.startingPoint,
                            drop: ride.destinationPoint,
                            date: ride.journeyDate,
                            time: ride.journeyTime,
                            distance: "~15 km",
                            duration: "~40 min",
                        },
                        vehicle: {
                            model: ride.vehicleName,
                            color: ride.vehicleColor,
                            number: ride.numberPlate,
                            features: ["AC", `${ride.seatingCapacity} Seats`],
                        },
                        seats: {
                            available: ride.availableSeats,
                            total: ride.seatingCapacity,
                        },
                        price: ride.seatPrice,
                        features: [],
                    }
                    listView.innerHTML += generatePoolCard(poolData)
                })
    
                listView.classList.remove("hidden")
                noResults.classList.add("hidden")
                addPoolCardEventListeners()
            } else {
                listView.classList.add("hidden")
                noResults.classList.remove("hidden")
            }
    
            resultsSection.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
            console.error("❌ Error fetching rides:", error)
            alert("Something went wrong while searching rides!")
        } finally {
            searchButton.innerHTML = originalButtonText
        }
    })
    

    // Modify Search button in No Results section
    document.getElementById("modify-search-btn").addEventListener("click", () => {
        // Hide results section and scroll back to search form
        resultsSection.classList.add("hidden")
        document.querySelector(".search-form-container").scrollIntoView({ behavior: "smooth" })
    })


    // View Toggle
    const listViewBtn = document.getElementById('list-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const mapView = document.getElementById('map-view');

    listViewBtn.addEventListener('click', function () {
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
        listView.classList.remove('hidden');
        mapView.classList.add('hidden');
    });

    mapViewBtn.addEventListener('click', function () {
        mapViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        mapView.classList.remove('hidden');
        listView.classList.add('hidden');
    });

    // Map Pins Click Event
    const mapPins = document.querySelectorAll('.map-pin');
    const mapListView = document.getElementById('map-list-view');

    mapPins.forEach(pin => {
        pin.addEventListener('click', function () {
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
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', function (e) {
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
            card.addEventListener('click', function (e) {
                if (!e.target.closest('.view-details-btn')) {
                    const poolId = this.getAttribute('data-id');
                    const poolData = getPoolData(poolId);
                    showPoolDetails(poolData);
                }
            });
        });

        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                const poolId = this.closest('.pool-card').getAttribute('data-id');
                const poolData = getPoolData(poolId);
                showPoolDetails(poolData);
            });
        });
    }

    function getPoolData(poolId) {
        // Find in fetched rides
        const ride = fetchedRides.find((r) => r._id === poolId);
    
        if (!ride) {
            console.error(`Ride not found for id: ${poolId}`);
            return null;
        }
    
        // Prepare data in expected format
        const poolData = {
            id: ride._id,
            driver: {
                name: ride.driverName,
                rating: 4.7,
                verified: true,
                avatar: ride.driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join(""),
            },
            route: {
                pickup: ride.startingPoint,
                drop: ride.destinationPoint,
                date: ride.journeyDate,
                time: ride.journeyTime,
                distance: "~15 km",
                duration: "~40 min",
            },
            vehicle: {
                model: ride.vehicleName,
                color: ride.vehicleColor,
                number: ride.numberPlate,
                features: ["AC", `${ride.seatingCapacity} Seats`],
            },
            seats: {
                available: ride.availableSeats,
                total: ride.seatingCapacity,
            },
            price: ride.seatPrice,
            features: [],
        };
    
        return poolData;
    }

    function showPoolDetails(poolData) {
        const rideModal = document.getElementById('pool-details-modal');
        const modalBody = rideModal.querySelector('.modal-body');

        // Fill Ride Details
        modalBody.innerHTML = `
            <h4>${poolData.driver.name} (${poolData.driver.rating} ★)</h4>
            <p><strong>Pickup:</strong> ${poolData.route.pickup}</p>
            <p><strong>Drop:</strong> ${poolData.route.drop}</p>
            <p><strong>Vehicle:</strong> ${poolData.vehicle.model} (${poolData.vehicle.color})</p>
            <p><strong>Seats Available:</strong> ${poolData.seats.available}/${poolData.seats.total}</p>
            <p><strong>Price:</strong> ₹${poolData.price}</p>
            <button id="book-now-btn" class="button primary">Book Now</button>
        `;

        // Open Ride Details Modal
        rideModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Book Now button handling
        const bookNowButton = document.getElementById('book-now-btn');
        bookNowButton.addEventListener('click', function () {
            // Close Ride Modal
            rideModal.classList.remove('active');

            // Open Payment Modal
            const paymentModal = document.getElementById('payment-method-modal');
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Update Payment Summary
            document.getElementById('payment-ride-fare').textContent = `₹${poolData.price}`;
            document.getElementById('payment-total-amount').textContent = `₹${poolData.price + 20}`;

            // Confirm Payment button handling
            const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
            confirmPaymentBtn.onclick = function () {
                // Close Payment Modal
                paymentModal.classList.remove('active');

                // Open Booking Success Modal
                const successModal = document.getElementById('booking-success-modal');
                successModal.classList.add('active');

                // Update booking success modal content
                document.getElementById('booking-datetime').textContent = `${poolData.route.date} - ${poolData.route.time}`;
                document.getElementById('booking-amount').textContent = `₹${poolData.price + 20}`;
                const selectedMethod = document.querySelector('input[name="payment-method"]:checked')
                    .nextElementSibling.querySelector('.payment-name').textContent;
                document.getElementById('booking-payment-method').textContent = selectedMethod;

                document.body.style.overflow = 'hidden';
            };
        });

        // All modal close buttons (X buttons)
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function () {
                this.closest('.modal').classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Done button in Success Modal
        const doneBtn = document.getElementById('close-success-modal');
        if (doneBtn) {
            doneBtn.onclick = function () {
                document.getElementById('booking-success-modal').classList.remove('active');
                document.body.style.overflow = '';
            };
        }
    }
});
// Function to show pool details with negotiation feature
function showPoolDetails(poolData) {
    const modal = document.getElementById('pool-details-modal');
    const modalBody = modal.querySelector('.modal-body');

    // Fill ride details with negotiation section
    modalBody.innerHTML = `
        <div class="pool-details">
            <div class="driver-info">
                <div class="driver-avatar">${poolData.driver.avatar}</div>
                <div class="driver-details">
                    <div class="driver-name">${poolData.driver.name}
                        ${poolData.driver.verified ? `
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
                        ${poolData.driver.rating} (${Math.floor(Math.random() * 100) + 50} rides)
                    </div>
                </div>
            </div>
            
            <div class="route-info">
                <div class="route-points">
                    <div class="route-point">
                        <div class="route-point-label">Pickup</div>
                        <div class="route-point-value">${poolData.route.pickup}</div>
                    </div>
                    <div class="route-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="route-point">
                        <div class="route-point-label">Drop</div>
                        <div class="route-point-value">${poolData.route.drop}</div>
                    </div>
                </div>
                
                <div class="route-details">
                    <div class="route-detail">
                        <div class="route-detail-label">Date</div>
                        <div class="route-detail-value">${poolData.route.date}</div>
                    </div>
                    <div class="route-detail">
                        <div class="route-detail-label">Time</div>
                        <div class="route-detail-value">${poolData.route.time}</div>
                    </div>
                    <div class="route-detail">
                        <div class="route-detail-label">Distance</div>
                        <div class="route-detail-value">${poolData.route.distance}</div>
                    </div>
                    <div class="route-detail">
                        <div class="route-detail-label">Duration</div>
                        <div class="route-detail-value">${poolData.route.duration}</div>
                    </div>
                </div>
            </div>
            
            <div class="vehicle-info">
                <div class="route-detail-label">Vehicle</div>
                <div class="route-detail-value">${poolData.vehicle.model} (${poolData.vehicle.color}) - ${poolData.vehicle.number}</div>
                <div class="vehicle-features">
                    ${poolData.vehicle.features.map(feature => `
                        <span class="vehicle-feature">${feature}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="seats-info">
                <div class="route-detail-label">Seats Available</div>
                <div class="route-detail-value">${poolData.seats.available}/${poolData.seats.total}</div>
            </div>
            
            <div class="price-info">
                <div class="route-detail-label">Price per person</div>
                <div class="route-detail-value price-value">₹${poolData.price}</div>
            </div>
        </div>
        
        <!-- Price Negotiation Section -->
        <div id="price-negotiation" class="price-negotiation">
            <h4>Negotiate Price</h4>
            <p>Suggest your price to the driver</p>
            <div class="negotiation-slider">
                <input type="range" id="negotiation-range" min="50" max="300" step="10" value="${poolData.price}">
                <div class="price-labels">
                    <span>₹50</span>
                    <span id="negotiated-price">₹${poolData.price}</span>
                    <span>₹300</span>
                </div>
            </div>
            <div class="negotiation-actions">
                <button id="send-offer-btn" class="button primary">Send Offer</button>
                <button id="book-now-btn" class="button secondary">Book at Original Price</button>
            </div>
        </div>
    `;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Price negotiation slider
    const negotiationRange = document.getElementById('negotiation-range');
    const negotiatedPrice = document.getElementById('negotiated-price');

    negotiationRange.addEventListener('input', function () {
        negotiatedPrice.textContent = `₹${this.value}`;
    });

    // Send offer button
    const sendOfferBtn = document.getElementById('send-offer-btn');
    sendOfferBtn.addEventListener('click', function () {
        // Simulate driver response (randomly accept or reject)
        const isAccepted = Math.random() > 0.5;
        showNegotiationResponse(isAccepted, negotiationRange.value, poolData);
    });

    // Book at original price button
    const bookNowBtn = document.getElementById('book-now-btn');
    bookNowBtn.addEventListener('click', function () {
        proceedToPayment(poolData, poolData.price);
    });
}

// Function to show negotiation response
function showNegotiationResponse(isAccepted, offeredPrice, poolData) {
    const modal = document.getElementById('pool-details-modal');
    modal.classList.remove('active');

    const responseModal = document.getElementById('negotiation-response-modal');
    const acceptedSection = document.getElementById('negotiation-accepted');
    const rejectedSection = document.getElementById('negotiation-rejected');

    if (isAccepted) {
        acceptedSection.style.display = 'block';
        rejectedSection.style.display = 'none';

        // Proceed with negotiated price button
        const proceedBtn = document.getElementById('proceed-with-negotiated-price');
        proceedBtn.onclick = function () {
            responseModal.classList.remove('active');
            proceedToPayment(poolData, offeredPrice);
        };
    } else {
        acceptedSection.style.display = 'none';
        rejectedSection.style.display = 'block';

        // Generate a counter offer (slightly higher than user's offer)
        const counterOffer = Math.min(poolData.price, Math.round(parseInt(offeredPrice) * 1.1 / 10) * 10);
        document.getElementById('counter-offer-price').textContent = `₹${counterOffer}`;

        // Accept counter offer button
        const acceptCounterBtn = document.getElementById('accept-counter-offer');
        acceptCounterBtn.onclick = function () {
            responseModal.classList.remove('active');
            proceedToPayment(poolData, counterOffer);
        };

        // Reject counter offer button
        const rejectCounterBtn = document.getElementById('reject-counter-offer');
        rejectCounterBtn.onclick = function () {
            responseModal.classList.remove('active');
            document.getElementById('pool-details-modal').classList.add('active');
        };
    }

    responseModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close modal button
    const closeModalBtn = responseModal.querySelector('.close-modal');
    closeModalBtn.addEventListener('click', function () {
        responseModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Function to proceed to payment
function proceedToPayment(poolData, finalPrice) {
    // Open Payment Modal
    const paymentModal = document.getElementById('payment-method-modal');
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update Payment Summary with negotiated price
    document.getElementById('payment-ride-fare').textContent = `₹${finalPrice}`;
    document.getElementById('payment-total-amount').textContent = `₹${parseInt(finalPrice) + 20}`;

    // Confirm Payment button handling
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    confirmPaymentBtn.onclick = function () {
        // Close Payment Modal
        paymentModal.classList.remove('active');

        // Open Booking Success Modal
        const successModal = document.getElementById('booking-success-modal');
        successModal.classList.add('active');

        // Update booking success modal content
        document.getElementById('booking-datetime').textContent = `${poolData.route.date} - ${poolData.route.time}`;
        document.getElementById('booking-amount').textContent = `₹${parseInt(finalPrice) + 20}`;
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked')
            .nextElementSibling.querySelector('.payment-name').textContent;
        document.getElementById('booking-payment-method').textContent = selectedMethod;

        document.body.style.overflow = 'hidden';
    };
}

// Update the generatePoolCard function to include a negotiable badge
function generatePoolCard(pool) {
    return `
        <div class="pool-card" data-id="${pool.id}">
            <div class="negotiable-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Negotiable
            </div>
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

function searchWithMockData(pickupLocation, dropLocation) {
    // Mock data for testing
    const mockRides = [
      {
        _id: "ride1",
        driverName: "Rahul Singh",
        startingPoint: "Indiranagar, Bangalore",
        destinationPoint: "Electronic City, Bangalore",
        journeyDate: "26 Apr, 2023",
        journeyTime: "09:30 AM",
        vehicleName: "Honda City",
        vehicleColor: "White",
        numberPlate: "KA 01 AB 1234",
        seatingCapacity: 4,
        availableSeats: 3,
        seatPrice: 180,
      },
      {
        _id: "ride2",
        driverName: "Priya Sharma",
        startingPoint: "Koramangala, Bangalore",
        destinationPoint: "Whitefield, Bangalore",
        journeyDate: "26 Apr, 2023",
        journeyTime: "10:00 AM",
        vehicleName: "Maruti Swift",
        vehicleColor: "Silver",
        numberPlate: "KA 05 CD 5678",
        seatingCapacity: 3,
        availableSeats: 2,
        seatPrice: 150,
      },
    ]
  
    // Filter the mock rides based on search criteria
    const filteredRides = mockRides.filter(
      (ride) =>
        ride.startingPoint.toLowerCase().includes(pickupLocation.toLowerCase()) &&
        ride.destinationPoint.toLowerCase().includes(dropLocation.toLowerCase()),
    )
  
    return filteredRides
  }

// Add these CSS styles for the negotiable badge