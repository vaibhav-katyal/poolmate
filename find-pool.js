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

        // Store the current pool data globally
        currentSelectedPool = poolData;

        // Fill Ride Details
        modalBody.innerHTML = `
            <h4>${poolData.driver.name} (${poolData.driver.rating} ★)</h4>
            <p><strong>Pickup:</strong> ${poolData.route.pickup}</p>
            <p><strong>Drop:</strong> ${poolData.route.drop}</p>
            <p><strong>Vehicle:</strong> ${poolData.vehicle.model} (${poolData.vehicle.color})</p>
            <p><strong>Seats Available:</strong> ${poolData.seats.available}/${poolData.seats.total}</p>
            <p><strong>Price:</strong> ₹${poolData.price}</p>
            <div class="pool-actions">
                <button id="book-now-btn" class="button primary">Book Now</button>
                <button id="negotiate-price-btn" class="button secondary">Negotiate Price</button>
            </div>
        `;

        // Open Ride Details Modal
        rideModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add event listener to the negotiate price button
        const negotiateBtn = document.getElementById('negotiate-price-btn');
        negotiateBtn.addEventListener('click', function () {
            console.log('Negotiate button clicked'); // For debugging
            rideModal.classList.remove('active');
            openPriceNegotiationModal(poolData);
        });

        // Book Now button handling
        const bookNowButton = document.getElementById('book-now-btn');
        bookNowButton.addEventListener('click', function () {
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

                const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
                if (selectedMethod && selectedMethod.nextElementSibling) {
                    const paymentName = selectedMethod.nextElementSibling.querySelector('.payment-name');
                    if (paymentName) {
                        document.getElementById('booking-payment-method').textContent = paymentName.textContent;
                    }
                }

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
    }
});
// Add this to your existing JavaScript file

// Function to generate pool cards with negotiable badge
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
            <!-- Rest of your pool card HTML -->
        </div>
    `;
}

// Add a "Negotiate Price" button to the pool details modal
// Global variables
let currentSelectedPool = null;

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the main negotiate price button if it exists on the page
    const negotiatePriceBtn = document.getElementById('negotiate-price-btn');
    if (negotiatePriceBtn) {
        negotiatePriceBtn.addEventListener('click', function () {
            // If we don't have pool data yet, use a default for testing
            const defaultPool = {
                price: 180,
                route: {
                    pickup: "Current Location",
                    drop: "Destination",
                    date: "27 Apr, 2025",
                    time: "10:00 AM"
                }
            };
            openPriceNegotiationModal(currentSelectedPool || defaultPool);
        });
    }

    // Initialize close buttons for all modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Setup driver response modal actions
    setupDriverResponseModalActions();
});

// Function to show pool details modal
function showPoolDetails(poolData) {
    const modal = document.getElementById('pool-details-modal');
    const modalBody = modal.querySelector('.modal-body');

    currentSelectedPool = poolData; // Store the selected pool data

    modalBody.innerHTML = `
        <div class="pool-details">
            <div class="booking-actions">
                <button id="negotiate-price-btn" class="button secondary">Negotiate Price</button>
                <button id="book-now-btn" class="button primary">Book Now</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Event Listeners
    document.getElementById('negotiate-price-btn').addEventListener('click', function () {
        modal.classList.remove('active');
        openPriceNegotiationModal(currentSelectedPool); // Open price negotiation modal
    });

    document.getElementById('book-now-btn').addEventListener('click', function () {
        modal.classList.remove('active');
        proceedToPayment(currentSelectedPool, currentSelectedPool.price); // Proceed to payment
    });
}

// Function to open price negotiation modal
function openPriceNegotiationModal(poolData) {
    const modal = document.getElementById('price-negotiation-modal');
    if (!modal) {
        console.error('Error: Price negotiation modal not found in the DOM');
        return;
    }

    // Fill ride info
    document.getElementById('negotiation-pickup').textContent = poolData.route.pickup;
    document.getElementById('negotiation-dropoff').textContent = poolData.route.drop;
    document.getElementById('negotiation-distance').textContent = poolData.route.distance || "~15 km";
    document.getElementById('negotiation-duration').textContent = poolData.route.duration || "~40 min";
    document.getElementById('suggested-price').textContent = `₹${poolData.price}`;

    const suggestedPrice = poolData.price;
    const minPrice = Math.round(suggestedPrice * 0.8);

    const customPriceInput = document.getElementById('custom-price-input');
    customPriceInput.value = suggestedPrice;
    customPriceInput.min = minPrice;
    customPriceInput.placeholder = `Min ₹${minPrice}`;

    // Setup quick price buttons
    const quickPriceButtons = document.querySelectorAll('.quick-price-btn');
    quickPriceButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.priceFactor == "1") button.classList.add('active');

        button.onclick = function () {
            const factor = parseFloat(this.dataset.priceFactor);
            const newPrice = Math.round(suggestedPrice * factor);
            customPriceInput.value = newPrice;
            quickPriceButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            validatePrice(newPrice, minPrice);
        }
    });

    // Setup custom price input validation
    customPriceInput.oninput = function () {
        validatePrice(parseInt(this.value) || 0, minPrice);
    };

    // Setup send price request button
    const sendPriceRequestBtn = document.getElementById('send-price-request-btn');
    sendPriceRequestBtn.onclick = function () {
        modal.classList.remove('active');
        openDriverResponseModal(poolData, parseInt(customPriceInput.value));
    };

    // Setup book at suggested price button
    const bookAtSuggestedBtn = document.getElementById('book-at-suggested-btn');
    bookAtSuggestedBtn.onclick = function () {
        modal.classList.remove('active');
        proceedToPayment(poolData, suggestedPrice);
    };

    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to validate price
function validatePrice(price, minPrice) {
    const priceWarning = document.getElementById('price-warning');
    const warningMessage = document.getElementById('warning-message');
    const sendPriceRequestBtn = document.getElementById('send-price-request-btn');

    if (price < minPrice) {
        priceWarning.classList.remove('hidden');
        warningMessage.textContent = `Price too low. Minimum recommended price is ₹${minPrice}.`;
        sendPriceRequestBtn.disabled = true;
        sendPriceRequestBtn.classList.add('disabled');
    } else {
        priceWarning.classList.add('hidden');
        sendPriceRequestBtn.disabled = false;
        sendPriceRequestBtn.classList.remove('disabled');
    }
}

// Function to open driver response modal
function openDriverResponseModal(poolData, requestedPrice) {
    const modal = document.getElementById('driver-response-modal');

    // Set the requested price in the UI
    document.querySelectorAll('#requested-price-display, #rejected-price-display').forEach(element => {
        element.textContent = `₹${requestedPrice}`;
    });

    // Show loading state
    showDriverResponseState('loading');

    // Set counter offer price (for this example, it's higher if user price is too low)
    const suggestedPrice = poolData.price;
    const counterOfferPrice = requestedPrice < suggestedPrice * 0.95 ? Math.round(suggestedPrice * 0.95) : requestedPrice;
    document.getElementById('counter-offer-display').textContent = `₹${counterOfferPrice}`;
    document.getElementById('accepted-price-display').textContent = `₹${requestedPrice}`;

    // Simulate driver response after a delay
    setTimeout(() => {
        const willAccept = requestedPrice >= suggestedPrice * 0.95;

        // Show appropriate response state
        showDriverResponseState(willAccept ? 'accepted' : 'rejected');
    }, 3000); // 3 second delay to simulate driver response

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initialize Socket.io connection
const currentUserId = "testUser123"; // Dummy userId set karo for testing

const socket = io('http://localhost:3000');

socket.emit('register', currentUserId);

socket.on('incoming-negotiation', (data) => {
    console.log('📢 New negotiation received:', data);
    alert(`New offer received: ₹${data.offerPrice}`);
});


console.log(`Emitted negotiation event to ${poolOwnerSocketId}`);
// Offer accepted notification for User
socket.on('offer-accepted', (data) => {
    alert('🎉 Your offer was accepted! Ride is confirmed.');
});

// Offer rejected notification for User
socket.on('offer-rejected', (data) => {
    alert('❌ Your offer was rejected.');
});

// Counter offer notification for User
socket.on('offer-counter', (data) => {
    const { counterPrice } = data;
    alert(`Driver countered your offer: ₹${counterPrice}`);
});


// Modal open karne ka code
const negotiateBtn = document.getElementById('negotiate-price-btn');
if (negotiateBtn) {
    negotiateBtn.addEventListener('click', function () {
        const price = prompt("Enter your offer price (₹):");
        if (price) {
            sendNegotiateRequest(price);
        }
    });
}

function openRideDetails(poolData) {
    modalBody.innerHTML = `
        <h4>${poolData.driver.name} (${poolData.driver.rating} ★)</h4>
        <p><strong>Pickup:</strong> ${poolData.route.pickup}</p>
        <p><strong>Drop:</strong> ${poolData.route.drop}</p>
        <p><strong>Vehicle:</strong> ${poolData.vehicle.model} (${poolData.vehicle.color})</p>
        <p><strong>Seats Available:</strong> ${poolData.seats.available}/${poolData.seats.total}</p>
        <p><strong>Price:</strong> ₹${poolData.price}</p>
        <div class="pool-actions">
            <button id="book-now-btn" class="button primary">Book Now</button>
            <button id="negotiate-price-btn" class="button secondary">Negotiate Price</button>
        </div>
    `;

    // Attach Event Listener Immediately After Modal is Ready
    setTimeout(() => {
        const negotiateBtn = document.getElementById('negotiate-price-btn');
        if (negotiateBtn) {
            negotiateBtn.addEventListener('click', function () {
                const price = prompt("Enter your offer price (₹):");
                if (price) {
                    sendNegotiateRequest(price);
                }
            });
        }
    }, 100); // 100ms delay optional to ensure DOM ready
}


// Send negotiate request
async function sendNegotiateRequest(price) {
    try {
        // Validate required parameters
        if (!price || isNaN(price)) {
            alert('Invalid price. Please enter a valid number.');
            return;
        }

        if (!selectedRideId) {
            console.error('Error: No ride selected.');
            alert('No ride selected. Please select a ride before sending a negotiation request.');
            return;
        }

        if (!currentUserId) {
            console.error('Error: User not logged in.');
            alert('You must be logged in to send a negotiation request.');
            return;
        }

        // Prepare request payload
        const rideId = selectedRideId;
        const userId = currentUserId;
        const requestBody = { rideId, userId, offerPrice: price };

        // Make the API call
        const response = await fetch('/api/negotiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Check HTTP response status
        if (!response.ok) {
            console.error('Failed to send negotiation request:', response.statusText);
            alert('Failed to send negotiation request. Please try again.');
            return;
        }

        // Parse response JSON
        const data = await response.json();
        if (data.success) {
            alert('Offer sent! Waiting for driver response.');
        } else {
            console.error('Negotiation request failed:', data.message || 'Unknown error');
            alert('Failed to send offer: ' + (data.message || 'Unknown error occurred.'));
        }
    } catch (error) {
        console.error('Negotiation error:', error);
        alert('An error occurred while sending the negotiation request. Please try again later.');
    }
}

function acceptOffer(negotiationId) {
    socket.emit('accept-offer', { negotiationId });
}

function rejectOffer(negotiationId) {
    socket.emit('reject-offer', { negotiationId });
}

function counterOffer(negotiationId, counterPrice) {
    socket.emit('counter-offer', { negotiationId, counterPrice });
}



// Function to show specific state in driver response modal
function showDriverResponseState(state) {
    const states = ['loading', 'accepted', 'rejected'];

    states.forEach(s => {
        const element = document.getElementById(`driver-response-${s}`);
        if (element) {
            if (s === state) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });

    // Start progress bar animation if in loading state
    if (state === 'loading') {
        const progressBar = document.querySelector('.timer-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 3s linear';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 50);
        }
    }
}

// Function to setup driver response modal actions
function setupDriverResponseModalActions() {
    // Handle accepted price button
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment-btn');
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener('click', function () {
            const modal = document.getElementById('driver-response-modal');
            modal.classList.remove('active');

            // Get the accepted price from the display
            const acceptedPrice = parseInt(document.getElementById('accepted-price-display').textContent.replace('₹', ''));
            proceedToPayment(currentSelectedPool, acceptedPrice);
        });
    }

    // Handle counter offer acceptance
    const acceptCounterOfferBtn = document.getElementById('accept-counter-offer-btn');
    if (acceptCounterOfferBtn) {
        acceptCounterOfferBtn.addEventListener('click', function () {
            const modal = document.getElementById('driver-response-modal');
            modal.classList.remove('active');

            // Get the counter offer price from the display
            const counterOfferPrice = parseInt(document.getElementById('counter-offer-display').textContent.replace('₹', ''));
            proceedToPayment(currentSelectedPool, counterOfferPrice);
        });
    }

    // Handle try new price button
    const tryNewPriceBtn = document.getElementById('try-new-price-btn');
    if (tryNewPriceBtn) {
        tryNewPriceBtn.addEventListener('click', function () {
            const modal = document.getElementById('driver-response-modal');
            modal.classList.remove('active');
            openPriceNegotiationModal(currentSelectedPool);
        });
    }

    // Handle find another driver button
    const findAnotherDriverBtn = document.getElementById('find-another-driver-btn');
    if (findAnotherDriverBtn) {
        findAnotherDriverBtn.addEventListener('click', function () {
            const modal = document.getElementById('driver-response-modal');
            modal.classList.remove('active');
            // This would typically redirect to the ride search or home page
            alert('Finding another driver... This would redirect to search page.');
        });
    }
}

// Proceed to payment
function proceedToPayment(poolData, finalPrice) {
    // Check if the payment modal exists
    const modal = document.getElementById('payment-method-modal');
    if (!modal) {
        // Create a simple alert if payment modal doesn't exist in the current implementation
        alert(`Payment initiated for ₹${finalPrice}. Payment processing would be implemented here.`);
        return;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('payment-ride-fare').textContent = `₹${finalPrice}`;
    document.getElementById('payment-total-amount').textContent = `₹${finalPrice}`; // Total = Final Price

    document.getElementById('confirm-payment-btn').onclick = function () {
        modal.classList.remove('active');

        const successModal = document.getElementById('booking-success-modal');
        successModal.classList.add('active');

        document.getElementById('booking-datetime').textContent = `${poolData.route?.date || '27 Apr, 2025'} - ${poolData.route?.time || '10:00 AM'}`;
        document.getElementById('booking-amount').textContent = `₹${parseInt(finalPrice) + 20}`;

        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked')?.nextElementSibling.querySelector('.payment-name')?.innerText;
        if (selectedPaymentMethod) {
            document.getElementById('booking-payment-method').textContent = selectedPaymentMethod;
        }

        document.body.style.overflow = 'hidden';
    };
}
const doneBtn = document.getElementById('close-success-modal');
if (doneBtn) {
    doneBtn.onclick = function () {
        document.getElementById('booking-success-modal').classList.remove('active');
        document.body.style.overflow = '';
    };
}