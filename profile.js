document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved theme preference
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabIndicator = document.querySelector('.tab-indicator');

    function updateTabIndicator(activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = document.querySelector('.tabs').getBoundingClientRect();

        tabIndicator.style.width = `${tabRect.width}px`;
        tabIndicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update tab indicator
            updateTabIndicator(this);

            // Show active tab content
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });

            // Animate chart bars if switching to rides-offered tab
            if (tabId === 'rides-offered') {
                animateChartBars();
            }
        });
    });

    // Fetch rides from the server
    async function fetchRides() {
        try {
            const response = await fetch('/api/rides');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rides = await response.json();
            displayRides(rides);
        } catch (error) {
            console.error('Error fetching rides:', error);
            showErrorMessage('Failed to load rides. Please try again later.');
        }
    }

    // Display rides in the UI
    function displayRides(rides) {
        const ridesContainer = document.querySelector('#rides-offered .ride-cards');
        ridesContainer.innerHTML = ''; // Clear existing rides

        if (rides.length === 0) {
            ridesContainer.innerHTML = '<div class="no-rides">No rides found. Offer a ride to get started!</div>';
            return;
        }

        rides.forEach((ride, index) => {
            const card = createRideCard(ride, index);
            ridesContainer.appendChild(card);
        });

        // Add animation to cards
        animateRideCards();
    }

    // Create a ride card element
    function createRideCard(ride, index) {
        const card = document.createElement('div');
        card.className = 'ride-card offered';
        card.style.animationDelay = `${index * 0.1}s`;

        // Format the price with currency symbol
        const formattedPrice = parseFloat(ride.seatPrice).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });

        // Get a placeholder image if vehicle image is not available
        const vehicleImage = ride.vehicleImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';

        card.innerHTML = `
                <div class="ride-card-header">
                    <div class="route">
                        <div class="location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>${ride.startingPoint}</span>
                        </div>
                        <div class="route-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                        <div class="location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>${ride.destinationPoint}</span>
                        </div>
                    </div>
                    <div class="seats-filled">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>${ride.availableSeats}/${ride.seatingCapacity} seats</span>
                    </div>
                </div>
                <div class="ride-card-body">
                    <div class="ride-info">
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>${ride.journeyDate}</span>
                        </div>
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>${ride.journeyTime}</span>
                        </div>
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <span>${formattedPrice}/seat</span>
                        </div>
                    </div>
                    <div class="vehicle-info">
                        <img src="${vehicleImage}" alt="${ride.vehicleName || 'Vehicle'}" loading="lazy">
                        <div>${ride.vehicleBrand || ''} ${ride.vehicleModel || ''} (${ride.vehicleColor || 'N/A'})</div>
                    </div>
                </div>
                <div class="ride-card-footer">
                    <button class="btn-view-details" data-ride-id="${ride._id}">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            `;

        // Add click event to view details button
        const viewDetailsBtn = card.querySelector('.btn-view-details');
        viewDetailsBtn.addEventListener('click', () => openRideDetailsModal(ride));

        return card;
    }

    // Animate ride cards on load
    function animateRideCards() {
        const cards = document.querySelectorAll('.ride-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Open ride details modal with enhanced animations
    function openRideDetailsModal(ride) {
        const modal = document.getElementById('ride-details-modal');

        // Update modal content with ride details
        document.getElementById('detail-start').textContent = ride.startingPoint;
        document.getElementById('detail-destination').textContent = ride.destinationPoint;
        document.getElementById('detail-date').textContent = ride.journeyDate;
        document.getElementById('detail-time').textContent = ride.journeyTime;

        // Format price
        const formattedPrice = parseFloat(ride.seatPrice).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        document.getElementById('detail-fare').textContent = formattedPrice + ' per seat';

        // Calculate estimated distance and duration (mock data for now)
        document.getElementById('detail-distance').textContent = '~35 miles';
        document.getElementById('detail-duration').textContent = '~45 minutes';

        // Driver and vehicle details
        document.getElementById('detail-driver-name').textContent = ride.driverName || 'Driver';
        document.getElementById('detail-vehicle-name').textContent = `${ride.vehicleBrand || ''} ${ride.vehicleModel || ''} ${ride.vehicleName || ''}`;
        document.getElementById('detail-vehicle-plate').textContent = ride.numberPlate || 'N/A';
        document.getElementById('detail-vehicle-color').textContent = ride.vehicleColor || 'N/A';

        // Update images
        if (ride.driverPhoto) {
            document.getElementById('detail-driver-img').src = ride.driverPhoto;
        } else {
            document.getElementById('detail-driver-img').src = 'https://randomuser.me/api/portraits/men/45.jpg';
        }

        if (ride.vehicleImage) {
            document.getElementById('detail-vehicle-img').src = ride.vehicleImage;
        } else {
            document.getElementById('detail-vehicle-img').src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';
        }

        // Update map image (using Google Maps Static API)
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(ride.startingPoint)}&zoom=11&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(ride.startingPoint)}&markers=color:blue%7C${encodeURIComponent(ride.destinationPoint)}&key=YOUR_API_KEY`;
        document.getElementById('detail-map-img').src = mapUrl;

        // Show modal with enhanced animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Add staggered animation to modal content
        const modalElements = modal.querySelectorAll('.modal-body > *');
        modalElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    // Close modal with animation
    const closeModalBtn = document.querySelector('.close-modal');
    const rideDetailsModal = document.getElementById('ride-details-modal');

    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    rideDetailsModal.addEventListener('click', function (e) {
        if (e.target === rideDetailsModal) {
            closeModal();
        }
    });

    function closeModal() {
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'translateY(50px) scale(0.95)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            rideDetailsModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
            // Reset transform after modal is hidden
            setTimeout(() => {
                modalContent.style.transform = '';
                modalContent.style.opacity = '';
            }, 300);
        }, 300);
    }

    // Show error message with animation
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-20px)';

        document.querySelector('.container').prepend(errorDiv);
        
        // Trigger animation
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove after 5 seconds with fade out
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 5000);
    }

    // Initialize
    fetchRides();

    // Add event listener for tab switching to refresh rides
    const ridesOfferedTab = document.querySelector('[data-tab="rides-offered"]');
    ridesOfferedTab.addEventListener('click', fetchRides);

    // Initialize tab indicator position
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        updateTabIndicator(activeTab);
    }

    // Filter Dropdown with enhanced animation
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const filterOptions = this.nextElementSibling;
            
            if (!filterOptions.classList.contains('active')) {
                // Prepare for animation
                const options = filterOptions.querySelectorAll('.filter-option');
                options.forEach((option, index) => {
                    option.style.opacity = '0';
                    option.style.transform = 'translateY(-10px)';
                });
                
                // Show dropdown
                filterOptions.classList.add('active');
                
                // Animate options
                options.forEach((option, index) => {
                    setTimeout(() => {
                        option.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        option.style.opacity = '1';
                        option.style.transform = 'translateY(0)';
                    }, 50 + (index * 50));
                });
            } else {
                filterOptions.classList.remove('active');
            }
        });
    });

    // Close filter dropdown when clicking outside
    document.addEventListener('click', function () {
        document.querySelectorAll('.filter-options').forEach(dropdown => {
            if (dropdown.classList.contains('active')) {
                const options = dropdown.querySelectorAll('.filter-option');
                
                // Animate options out
                options.forEach((option, index) => {
                    option.style.opacity = '0';
                    option.style.transform = 'translateY(-10px)';
                });
                
                // Hide dropdown after animation
                setTimeout(() => {
                    dropdown.classList.remove('active');
                    // Reset styles
                    options.forEach(option => {
                        option.style.opacity = '';
                        option.style.transform = '';
                    });
                }, 200);
            }
        });
    });

    // Filter Options with enhanced interaction
    const filterOptions = document.querySelectorAll('.filter-option');

    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const filterText = this.textContent;
            const filterBtn = this.closest('.filter-dropdown').querySelector('.filter-btn');
            const filterOptions = this.closest('.filter-options');
            
            // Add visual feedback
            this.style.backgroundColor = 'var(--accent-color)';
            this.style.color = 'white';
            
            // Update filter button text with animation
            filterBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                ${filterText}
            `;
            
            // Animate button
            filterBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                filterBtn.style.transform = '';
            }, 300);

            // Close dropdown with animation
            const options = filterOptions.querySelectorAll('.filter-option');
            options.forEach((opt, index) => {
                if (opt !== this) {
                    opt.style.opacity = '0';
                    opt.style.transform = 'translateY(-10px)';
                }
            });
            
            setTimeout(() => {
                filterOptions.classList.remove('active');
                // Reset styles
                options.forEach(opt => {
                    opt.style.opacity = '';
                    opt.style.transform = '';
                    opt.style.backgroundColor = '';
                    opt.style.color = '';
                });
            }, 200);

            // Here you would implement the actual filtering logic
            console.log(`Filtering by: ${filterText}`);
            
            // Add visual feedback for filtered content
            const rideCards = document.querySelectorAll('.ride-card');
            rideCards.forEach(card => {
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.98)';
            });
            
            setTimeout(() => {
                rideCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, index * 50);
                });
            }, 300);
        });
    });

    // Enhanced Chart Animation
    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');

        chartBars.forEach(bar => {
            const value = bar.getAttribute('data-value');
            const maxValue = 300; // Assuming max value is 300
            const heightPercentage = (value / maxValue) * 100;

            // Reset height first
            const barFill = bar.querySelector('.bar-fill');
            barFill.style.height = '0';
            barFill.style.transition = 'none';

            // Trigger reflow
            void bar.offsetWidth;

            // Add gradient and shadow for enhanced look
            barFill.style.background = 'linear-gradient(to top, var(--accent-color), #6d8dff)';
            barFill.style.boxShadow = '0 0 10px rgba(67, 97, 238, 0.3)';
            
            // Animate height with easing
            setTimeout(() => {
                barFill.style.transition = 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                barFill.style.height = `${heightPercentage}%`;
                
                // Add label animation
                const label = bar.querySelector('.bar-label');
                if (label) {
                    label.style.opacity = '0';
                    label.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        label.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        label.style.opacity = '1';
                        label.style.transform = 'translateY(0)';
                    }, 500);
                }
            }, 100);
        });
    }

    // Trigger chart animation on page load if rides-offered tab is active
    if (document.querySelector('#rides-offered').classList.contains('active')) {
        animateChartBars();
    }

    // Enhanced Period Button Selection
    const periodButtons = document.querySelectorAll('.period-btn');

    periodButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Skip if already active
            if (this.classList.contains('active')) return;
            
            // Deactivate all buttons with animation
            periodButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    btn.style.transform = 'scale(0.95)';
                    btn.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        btn.classList.remove('active');
                        btn.style.transform = '';
                        btn.style.opacity = '';
                    }, 200);
                }
            });
            
            // Activate clicked button with animation
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.classList.add('active');
                this.style.transform = '';
            }, 200);

            const period = this.getAttribute('data-period');
            console.log(`Selected period: ${period}`);

            // Add visual feedback for chart update
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer) {
                chartContainer.style.opacity = '0.5';
                chartContainer.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    chartContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    chartContainer.style.opacity = '1';
                    chartContainer.style.transform = 'scale(1)';
                    
                    // Re-animate chart
                    animateChartBars();
                }, 300);
            }
        });
    });

    // View Details Modal with enhanced interaction
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const closeModalButton = document.querySelector('.close-modal');
    const rideDetailsModal2 = document.getElementById('ride-details-modal');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            const rideId = this.getAttribute('data-ride-id');
            const offerId = this.getAttribute('data-offer-id');

            if (rideId) {
                // Load ride details
                loadRideDetails(rideId);
            } else if (offerId) {
                // Load offer details
                loadOfferDetails(offerId);
            }

            // Show modal with enhanced animation
            rideDetailsModal2.style.backdropFilter = 'blur(0px)';
            rideDetailsModal2.classList.add('active');
            
            setTimeout(() => {
                rideDetailsModal2.style.transition = 'backdrop-filter 0.5s ease';
                rideDetailsModal2.style.backdropFilter = 'blur(5px)';
            }, 10);

            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    });

    // Enhanced close modal button
    closeModalButton.addEventListener('click', function () {
        // Add click animation
        this.style.transform = 'rotate(90deg)';
        
        closeModal();
    });

    // Close modal when clicking outside
    rideDetailsModal2.addEventListener('click', function (e) {
        if (e.target === rideDetailsModal2) {
            rideDetailsModal2.style.backdropFilter = 'blur(0px)';
            closeModal();
        }
    });

    // Prevent modal content clicks from closing the modal
    rideDetailsModal2.querySelector('.modal-content').addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Enhanced mock data loading functions
    function loadRideDetails(rideId) {
        console.log(`Loading details for ride ${rideId}`);

        // Show loading indicator
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="loading-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                <p>Loading ride details...</p>
            </div>
        `;

        // This would typically be an API call
        // For now, we'll just update the modal with mock data after a short delay
        setTimeout(() => {
            // Sample data for different rides
            const rideData = {
                '1': {
                    start: 'San Francisco',
                    destination: 'Palo Alto',
                    date: 'May 15, 2023',
                    time: '8:30 AM',
                    fare: '$25.00',
                    distance: '35 miles',
                    duration: '45 minutes',
                    rating: 5.0,
                    driver: 'Michael Smith',
                    vehicle: 'Tesla Model 3',
                    plate: 'ABC 123',
                    color: 'White'
                },
                '2': {
                    start: 'Oakland',
                    destination: 'San Francisco',
                    date: 'June 2, 2023',
                    time: '5:45 PM',
                    fare: '$18.50',
                    distance: '12 miles',
                    duration: '25 minutes',
                    rating: 5.0,
                    driver: 'Sarah Johnson',
                    vehicle: 'Honda Civic',
                    plate: 'XYZ 789',
                    color: 'Blue'
                },
                '3': {
                    start: 'San Jose',
                    destination: 'Mountain View',
                    date: 'July 10, 2023',
                    time: '10:15 AM',
                    fare: '$22.75',
                    distance: '15 miles',
                    duration: '20 minutes',
                    rating: 3.5,
                    driver: 'David Lee',
                    vehicle: 'Toyota Prius',
                    plate: 'DEF 456',
                    color: 'Silver'
                },
                '4': {
                    start: 'Berkeley',
                    destination: 'San Francisco',
                    date: 'August 5, 2023',
                    time: '3:20 PM',
                    fare: '$15.00',
                    distance: '14 miles',
                    duration: '30 minutes',
                    rating: 4.0,
                    driver: 'Emily Chen',
                    vehicle: 'Ford Focus',
                    plate: 'GHI 789',
                    color: 'Red'
                },
                '5': {
                    start: 'San Francisco',
                    destination: 'San Jose',
                    date: 'September 12, 2023',
                    time: '7:45 AM',
                    fare: '$30.50',
                    distance: '50 miles',
                    duration: '55 minutes',
                    rating: 3.0,
                    driver: 'Robert Wilson',
                    vehicle: 'Hyundai Sonata',
                    plate: 'JKL 012',
                    color: 'Black'
                }
            };

            const ride = rideData[rideId] || rideData['1'];

            // Rebuild modal content
            modalBody.innerHTML = `
                <div class="ride-detail-header">
                    <div class="route-detail">
                        <div class="location-detail">
                            <div class="location-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <div class="location-info">
                                <div class="location-label">Starting Point</div>
                                <div class="location-name" id="detail-start">${ride.start}</div>
                            </div>
                        </div>
                        <div class="route-line"></div>
                        <div class="location-detail">
                            <div class="location-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div class="location-info">
                                <div class="location-label">Destination</div>
                                <div class="location-name" id="detail-destination">${ride.destination}</div>
                            </div>
                        </div>
                    </div>
                    <div class="ride-date-time">
                        <div class="date-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span id="detail-date">${ride.date}</span>
                        </div>
                        <div class="time-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span id="detail-time">${ride.time}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-map">
                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=${ride.start},CA&zoom=11&size=600x300&maptype=roadmap&markers=color:red%7C${ride.start},CA&markers=color:blue%7C${ride.destination},CA&key=YOUR_API_KEY"
                        alt="Route Map" id="detail-map-img">
                </div>

                <div class="detail-sections">
                    <div class="detail-section">
                        <h4>Ride Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Fare</div>
                                <div class="detail-value" id="detail-fare">${ride.fare}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Distance</div>
                                <div class="detail-value" id="detail-distance">${ride.distance}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Duration</div>
                                <div class="detail-value" id="detail-duration">${ride.duration}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Rating</div>
                                <div class="detail-value" id="detail-rating">
                                    <div class="stars">
                                        <!-- Stars will be added by updateRatingStars function -->
                                    </div>
                                    <span>${ride.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Driver & Vehicle</h4>
                        <div class="driver-vehicle-info">
                            <div class="driver-info">
                                <div class="driver-photo">
                                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Driver Photo"
                                        id="detail-driver-img">
                                </div>
                                <div class="driver-details">
                                    <div class="driver-name" id="detail-driver-name">${ride.driver}</div>
                                    <div class="driver-rating">
                                        <div class="stars">
                                            <!-- Stars will be added dynamically -->
                                        </div>
                                        <span>${ride.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="vehicle-details">
                                <div class="vehicle-photo">
                                    <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                                        alt="Vehicle Photo" id="detail-vehicle-img">
                                </div>
                                <div class="vehicle-info-details">
                                    <div class="vehicle-name" id="detail-vehicle-name">${ride.vehicle}</div>
                                    <div class="vehicle-plate" id="detail-vehicle-plate">${ride.plate}</div>
                                    <div class="vehicle-color" id="detail-vehicle-color">${ride.color}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Update rating stars
            updateRatingStars(ride.rating);
            
            // Add animation to modal elements
            const elements = modalBody.querySelectorAll('> *');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }, 800);
    }

    function loadOfferDetails(offerId) {
        console.log(`Loading details for offer ${offerId}`);

        // Show loading indicator
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="loading-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                <p>Loading offer details...</p>
            </div>
        `;

        // This would typically be an API call
        // For now, we'll just update the modal with mock data after a short delay
        setTimeout(() => {
            // Sample data for different offers
            const offerData = {
                '1': {
                    start: 'San Francisco',
                    destination: 'Palo Alto',
                    date: 'June 15, 2023',
                    time: '8:00 AM',
                    fare: '$75.00',
                    distance: '35 miles',
                    duration: '45 minutes',
                    rating: 4.8,
                    driver: 'Alex Johnson (You)',
                    vehicle: 'Tesla Model 3',
                    plate: 'ABC 123',
                    color: 'White',
                    seats: '3/4 seats filled'
                },
                '2': {
                    start: 'San Francisco',
                    destination: 'Oakland',
                    date: 'July 22, 2023',
                    time: '5:30 PM',
                    fare: '$100.00',
                    distance: '12 miles',
                    duration: '25 minutes',
                    rating: 4.9,
                    driver: 'Alex Johnson (You)',
                    vehicle: 'Tesla Model 3',
                    plate: 'ABC 123',
                    color: 'White',
                    seats: '4/4 seats filled'
                },
                '3': {
                    start: 'San Jose',
                    destination: 'San Francisco',
                    date: 'August 10, 2023',
                    time: '7:15 AM',
                    fare: '$50.00',
                    distance: '50 miles',
                    duration: '55 minutes',
                    rating: 4.7,
                    driver: 'Alex Johnson (You)',
                    vehicle: 'Tesla Model 3',
                    plate: 'ABC 123',
                    color: 'White',
                    seats: '2/4 seats filled'
                }
            };

            const offer = offerData[offerId] || offerData['1'];

            // Rebuild modal content
            modalBody.innerHTML = `
                <div class="ride-detail-header">
                    <div class="route-detail">
                        <div class="location-detail">
                            <div class="location-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <div class="location-info">
                                <div class="location-label">Starting Point</div>
                                <div class="location-name" id="detail-start">${offer.start}</div>
                            </div>
                        </div>
                        <div class="route-line"></div>
                        <div class="location-detail">
                            <div class="location-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div class="location-info">
                                <div class="location-label">Destination</div>
                                <div class="location-name" id="detail-destination">${offer.destination}</div>
                            </div>
                        </div>
                    </div>
                    <div class="ride-date-time">
                        <div class="date-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span id="detail-date">${offer.date}</span>
                        </div>
                        <div class="time-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span id="detail-time">${offer.time}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-map">
                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=${offer.start},CA&zoom=11&size=600x300&maptype=roadmap&markers=color:red%7C${offer.start},CA&markers=color:blue%7C${offer.destination},CA&key=YOUR_API_KEY"
                        alt="Route Map" id="detail-map-img">
                </div>

                <div class="detail-sections">
                    <div class="detail-section">
                        <h4>Ride Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Earnings</div>
                                <div class="detail-value" id="detail-fare">${offer.fare}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Distance</div>
                                <div class="detail-value" id="detail-distance">${offer.distance}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Duration</div>
                                <div class="detail-value" id="detail-duration">${offer.duration}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Seats</div>
                                <div class="detail-value" id="detail-seats">${offer.seats}</div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Driver & Vehicle</h4>
                        <div class="driver-vehicle-info">
                            <div class="driver-info">
                                <div class="driver-photo">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver Photo"
                                        id="detail-driver-img">
                                </div>
                                <div class="driver-details">
                                    <div class="driver-name" id="detail-driver-name">${offer.driver}</div>
                                    <div class="driver-rating">
                                        <div class="stars">
                                            <!-- Stars will be added dynamically -->
                                        </div>
                                        <span>${offer.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="vehicle-details">
                                <div class="vehicle-photo">
                                    <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                                        alt="Vehicle Photo" id="detail-vehicle-img">
                                </div>
                                <div class="vehicle-info-details">
                                    <div class="vehicle-name" id="detail-vehicle-name">${offer.vehicle}</div>
                                    <div class="vehicle-plate" id="detail-vehicle-plate">${offer.plate}</div>
                                    <div class="vehicle-color" id="detail-vehicle-color">${offer.color}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Update rating stars
            updateRatingStars(offer.rating);
            
            // Add animation to modal elements
            const elements = modalBody.querySelectorAll('> *');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }, 800);
    }

    // Enhanced rating stars with animation
    function updateRatingStars(rating) {
        const starsContainers = document.querySelectorAll('.stars');
        
        starsContainers.forEach(starsContainer => {
            starsContainer.innerHTML = '';

            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.classList.add('star');
                star.style.opacity = '0';
                star.style.transform = 'scale(0.5)';

                if (i <= Math.floor(rating)) {
                    star.classList.add('filled');
                } else if (i - 0.5 <= rating) {
                    star.classList.add('half-filled');
                }

                starsContainer.appendChild(star);
                
                // Animate stars appearing one by one
                setTimeout(() => {
                    star.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    star.style.opacity = '1';
                    star.style.transform = 'scale(1)';
                }, 100 + (i * 100));
            }

            const ratingText = starsContainer.nextElementSibling;
            if (ratingText) {
                ratingText.style.opacity = '0';
                
                setTimeout(() => {
                    ratingText.style.transition = 'opacity 0.5s ease';
                    ratingText.style.opacity = '1';
                    ratingText.textContent = rating.toFixed(1);
                }, 600);
            }
        });
    }

    // Enhanced Profile Photo Animation
    const profilePhoto = document.querySelector('.profile-photo');

    if (profilePhoto) {
        profilePhoto.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
            this.style.transform = 'scale(1.05) rotate(3deg)';
            this.style.boxShadow = '0 0 0 6px rgba(67, 97, 238, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)';
        });

        profilePhoto.addEventListener('mouseleave', function () {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }

    // Initialize chart bars on page load with enhanced animation
    window.addEventListener('load', function () {
        if (document.querySelector('#rides-offered').classList.contains('active')) {
            // Add a slight delay for better visual effect
            setTimeout(() => {
                animateChartBars();
            }, 300);
        }
        
        // Add subtle entrance animation to profile card
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.style.opacity = '0';
            profileCard.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                profileCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                profileCard.style.opacity = '1';
                profileCard.style.transform = 'translateY(0)';
            }, 100);
        }
    });

    // Window resize event to update tab indicator with debounce
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                updateTabIndicator(activeTab);
            }
        }, 100);
    });
    
    // Add loading spinner CSS
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            color: var(--text-secondary);
        }
        
        .loading-spinner {
            animation: spin 1.5s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-message {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-left: 4px solid #ef4444;
        }
    `;
    document.head.appendChild(style);
});