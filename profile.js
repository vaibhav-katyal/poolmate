document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', function() {
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
        button.addEventListener('click', function() {
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
    
    // Initialize tab indicator position
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        updateTabIndicator(activeTab);
    }
    
    // Filter Dropdown
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const filterOptions = this.nextElementSibling;
            filterOptions.classList.toggle('active');
        });
    });
    
    // Close filter dropdown when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.filter-options').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Filter Options
    const filterOptions = document.querySelectorAll('.filter-option');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const filterText = this.textContent;
            const filterBtn = this.closest('.filter-dropdown').querySelector('.filter-btn');
            
            // Update filter button text (optional)
            // filterBtn.innerHTML = `<svg>...</svg> ${filterText}`;
            
            // Close dropdown
            this.closest('.filter-options').classList.remove('active');
            
            // Here you would implement the actual filtering logic
            console.log(`Filtering by: ${filterText}`);
        });
    });
    
    // Chart Animation
    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');
        
        chartBars.forEach(bar => {
            const value = bar.getAttribute('data-value');
            const maxValue = 300; // Assuming max value is 300
            const heightPercentage = (value / maxValue) * 100;
            
            // Reset height first
            const barFill = bar.querySelector('.bar-fill');
            barFill.style.height = '0';
            
            // Trigger reflow
            void bar.offsetWidth;
            
            // Animate height
            setTimeout(() => {
                barFill.style.height = `${heightPercentage}%`;
            }, 100);
        });
    }
    
    // Trigger chart animation on page load if rides-offered tab is active
    if (document.querySelector('#rides-offered').classList.contains('active')) {
        animateChartBars();
    }
    
    // Period Button Selection
    const periodButtons = document.querySelectorAll('.period-btn');
    
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            console.log(`Selected period: ${period}`);
            
            // Here you would update the chart data based on the selected period
            // For now, just re-animate the chart
            animateChartBars();
        });
    });
    
    // View Details Modal
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const modal = document.getElementById('ride-details-modal');
    const closeModalButton = document.querySelector('.close-modal');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rideId = this.getAttribute('data-ride-id');
            const offerId = this.getAttribute('data-offer-id');
            
            if (rideId) {
                // Load ride details
                loadRideDetails(rideId);
            } else if (offerId) {
                // Load offer details
                loadOfferDetails(offerId);
            }
            
            // Show modal
            modal.classList.add('active');
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('active');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Prevent modal content clicks from closing the modal
    modal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Mock data loading functions
    function loadRideDetails(rideId) {
        console.log(`Loading details for ride ${rideId}`);
        
        // This would typically be an API call
        // For now, we'll just update the modal with mock data
        
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
        
        // Update modal content
        document.getElementById('detail-start').textContent = ride.start;
        document.getElementById('detail-destination').textContent = ride.destination;
        document.getElementById('detail-date').textContent = ride.date;
        document.getElementById('detail-time').textContent = ride.time;
        document.getElementById('detail-fare').textContent = ride.fare;
        document.getElementById('detail-distance').textContent = ride.distance;
        document.getElementById('detail-duration').textContent = ride.duration;
        document.getElementById('detail-driver-name').textContent = ride.driver;
        document.getElementById('detail-vehicle-name').textContent = ride.vehicle;
        document.getElementById('detail-vehicle-plate').textContent = ride.plate;
        document.getElementById('detail-vehicle-color').textContent = ride.color;
        
        // Update map image
        document.getElementById('detail-map-img').src = `https://maps.googleapis.com/maps/api/staticmap?center=${ride.start},CA&zoom=11&size=600x300&maptype=roadmap&markers=color:red%7C${ride.start},CA&markers=color:blue%7C${ride.destination},CA&key=YOUR_API_KEY`;
        
        // Update rating stars
        updateRatingStars(ride.rating);
    }
    
    function loadOfferDetails(offerId) {
        console.log(`Loading details for offer ${offerId}`);
        
        // This would typically be an API call
        // For now, we'll just update the modal with mock data
        
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
        
        // Update modal content
        document.getElementById('detail-start').textContent = offer.start;
        document.getElementById('detail-destination').textContent = offer.destination;
        document.getElementById('detail-date').textContent = offer.date;
        document.getElementById('detail-time').textContent = offer.time;
        document.getElementById('detail-fare').textContent = offer.fare;
        document.getElementById('detail-distance').textContent = offer.distance;
        document.getElementById('detail-duration').textContent = offer.duration;
        document.getElementById('detail-driver-name').textContent = offer.driver;
        document.getElementById('detail-vehicle-name').textContent = offer.vehicle;
        document.getElementById('detail-vehicle-plate').textContent = offer.plate;
        document.getElementById('detail-vehicle-color').textContent = offer.color;
        
        // Update map image
        document.getElementById('detail-map-img').src = `https://maps.googleapis.com/maps/api/staticmap?center=${offer.start},CA&zoom=11&size=600x300&maptype=roadmap&markers=color:red%7C${offer.start},CA&markers=color:blue%7C${offer.destination},CA&key=YOUR_API_KEY`;
        
        // Update rating stars
        updateRatingStars(offer.rating);
    }
    
    function updateRatingStars(rating) {
        const starsContainer = document.querySelector('#detail-rating .stars');
        starsContainer.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            
            if (i <= Math.floor(rating)) {
                star.classList.add('filled');
            } else if (i - 0.5 <= rating) {
                star.classList.add('half-filled');
            }
            
            starsContainer.appendChild(star);
        }
        
        const ratingText = starsContainer.nextElementSibling;
        ratingText.textContent = rating.toFixed(1);
    }
    
    // Profile Photo Animation
    const profilePhoto = document.querySelector('.profile-photo');
    
    if (profilePhoto) {
        profilePhoto.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 0 6px rgba(67, 97, 238, 0.3)';
        });
        
        profilePhoto.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Initialize chart bars on page load
    window.addEventListener('load', function() {
        if (document.querySelector('#rides-offered').classList.contains('active')) {
            animateChartBars();
        }
    });
    
    // Window resize event to update tab indicator
    window.addEventListener('resize', function() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            updateTabIndicator(activeTab);
        }
    });
});