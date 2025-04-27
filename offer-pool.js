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

    // Form Navigation
    const forms = document.querySelectorAll('.step-form');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    let currentStep = 1;

    // Form Data Object
    let formData = {
        route: {},
        vehicle: {},
        images: {}
    };

    // Continue Buttons
    const continueButtons = document.querySelectorAll('.btn-continue');
    continueButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (validateCurrentStep()) {
                saveCurrentStepData();
                goToNextStep();
            }
        });
    });

    // Back Buttons
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(button => {
        button.addEventListener('click', function () {
            goToPreviousStep();
        });
    });

    // Vehicle Type Selection
    const vehicleTypeCards = document.querySelectorAll('.selection-card[data-value]');
    vehicleTypeCards.forEach(card => {
        card.addEventListener('click', function () {
            const value = this.getAttribute('data-value');

            // For vehicle type selection
            if (this.parentElement.previousElementSibling.textContent === 'Vehicle Type') {
                document.getElementById('vehicle-type').value = value;

                // Remove selected class from all cards in this group
                this.parentElement.querySelectorAll('.selection-card').forEach(c => {
                    c.classList.remove('selected');
                });

                // Add selected class to clicked card
                this.classList.add('selected');

                // Show/hide seating options based on vehicle type
                const seatingOptions = document.getElementById('seating-options');
                const availableSeats = document.getElementById('available-seats');
                const pricePerSeat = document.getElementById('price-per-seat');

                if (value === '4-wheeler') {
                    seatingOptions.classList.remove('hidden');
                    availableSeats.classList.remove('hidden');
                    pricePerSeat.classList.remove('hidden');
                } else {
                    seatingOptions.classList.add('hidden');
                    availableSeats.classList.add('hidden');
                    pricePerSeat.classList.add('hidden');

                    // Reset seating capacity
                    document.getElementById('seating-capacity').value = '';
                    document.querySelectorAll('#seating-options .selection-card').forEach(c => {
                        c.classList.remove('selected');
                    });
                }
            }

            // For seating capacity selection
            if (this.parentElement.previousElementSibling.textContent === 'Seating Capacity') {
                document.getElementById('seating-capacity').value = value;

                // Remove selected class from all cards in this group
                this.parentElement.querySelectorAll('.selection-card').forEach(c => {
                    c.classList.remove('selected');
                });

                // Add selected class to clicked card
                this.classList.add('selected');

                // Update max available seats
                const seatCountInput = document.getElementById('seat-count');
                seatCountInput.max = value;

                // Reset seat count if it's more than the new max
                if (parseInt(seatCountInput.value) > parseInt(value)) {
                    seatCountInput.value = value;
                }
            }
        });
    });

    // Seat Count Increment/Decrement
    const decrementBtn = document.querySelector('.decrement');
    const incrementBtn = document.querySelector('.increment');
    const seatCountInput = document.getElementById('seat-count');

    decrementBtn.addEventListener('click', function () {
        const currentValue = parseInt(seatCountInput.value);
        if (currentValue > parseInt(seatCountInput.min)) {
            seatCountInput.value = currentValue - 1;
        }
    });

    incrementBtn.addEventListener('click', function () {
        const currentValue = parseInt(seatCountInput.value);
        if (currentValue < parseInt(seatCountInput.max)) {
            seatCountInput.value = currentValue + 1;
        }
    });

    // File Upload Handling
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');

    fileUploadAreas.forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        const previewContainer = area.parentElement.querySelector('.image-preview');

        // Click on upload area
        area.addEventListener('click', function () {
            fileInput.click();
        });

        // Drag and drop
        area.addEventListener('dragover', function (e) {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', function () {
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', function (e) {
            e.preventDefault();
            area.classList.remove('dragover');

            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload(fileInput, previewContainer);
            }
        });

        // File input change
        fileInput.addEventListener('change', function () {
            handleFileUpload(this, previewContainer);
        });
    });

    // Form Submission
    // Form Submission
    const step3Form = document.getElementById('step3-form');

    step3Form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const publishBtn = step3Form.querySelector('.btn-publish'); // 🛑 Tumhara missing tha, add kiya
        publishBtn.disabled = true;
        publishBtn.innerHTML = `
        <svg class="loader" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path d="M22 12a10 10 0 1 1-10-10" fill="currentColor" />
        </svg>
        Publishing...
    `;

        const fullName = localStorage.getItem('fullName');

        if (!fullName) {
            alert('User not logged in properly.');

            // ✅ Button ko wapas normal kar dena agar login missing hai
            publishBtn.disabled = false;
            publishBtn.innerHTML = `
            Publish Offer
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4"></path>
                <path d="m4.93 10.93 2.83-2.83"></path>
                <path d="M2 18h4"></path>
                <path d="m19.07 10.93-2.83-2.83"></path>
                <path d="M18 18h4"></path>
                <path d="m8.93 19.07 2.83 2.83"></path>
                <path d="m12.93 16.93 2.83 2.83"></path>
                <path d="M12 22v-4"></path>
            </svg>
        `;
            return;
        }

        const formDataToSend = new FormData();

        // Basic details
        formDataToSend.append('driverName', fullName);
        formDataToSend.append('startingPoint', formData.route.startingPoint);
        formDataToSend.append('destinationPoint', formData.route.destinationPoint);
        formDataToSend.append('journeyDate', formData.route.journeyDate);
        formDataToSend.append('journeyTime', formData.route.journeyTime);
        formDataToSend.append('vehicleType', formData.route.vehicleType);
        formDataToSend.append('seatingCapacity', formData.route.seatingCapacity || '');
        formDataToSend.append('availableSeats', formData.route.availableSeats || '');
        formDataToSend.append('seatPrice', formData.route.seatPrice || '');
        formDataToSend.append('additionalNote', formData.route.additionalNote || '');

        formDataToSend.append('vehicleName', formData.vehicle.vehicleName);
        formDataToSend.append('vehicleBrand', formData.vehicle.vehicleBrand);
        formDataToSend.append('vehicleModel', formData.vehicle.vehicleModel);
        formDataToSend.append('vehicleColor', formData.vehicle.vehicleColor);
        formDataToSend.append('numberPlate', formData.vehicle.numberPlate);

        // Images (Data URLs to File)
        function dataURLtoFile(dataurl, filename) {
            let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        if (formData.images.vehicleImage) {
            formDataToSend.append('vehicleImage', dataURLtoFile(formData.images.vehicleImage, 'vehicle.jpg'));
        }
        if (formData.images.licenseImage) {
            formDataToSend.append('licenseImage', dataURLtoFile(formData.images.licenseImage, 'license.jpg'));
        }
        if (formData.images.driverPhoto) {
            formDataToSend.append('driverPhoto', dataURLtoFile(formData.images.driverPhoto, 'driver.jpg'));
        }

        try {
            const response = await fetch('/api/offer', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                // ✅ Show success modal
                const successModal = document.getElementById('success-modal');
                successModal.classList.add('active');
            } else {
                alert('❌ Failed to publish offer.');
            }
        } catch (error) {
            console.error('❌ Error while submitting offer:', error);
            alert('Something went wrong.');
        } finally {
            // ✅ Button ko wapas normal kar dena har case me
            publishBtn.disabled = false;
            publishBtn.innerHTML = `
            Publish Offer
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4"></path>
                <path d="m4.93 10.93 2.83-2.83"></path>
                <path d="M2 18h4"></path>
                <path d="m19.07 10.93-2.83-2.83"></path>
                <path d="M18 18h4"></path>
                <path d="m8.93 19.07 2.83 2.83"></path>
                <path d="m12.93 16.93 2.83 2.83"></path>
                <path d="M12 22v-4"></path>
            </svg>
        `;
        }
    });


    // Close Modal
    const closeModalBtn = document.querySelector('.btn-close-modal');
    closeModalBtn.addEventListener('click', function () {
        const successModal = document.getElementById('success-modal');
        successModal.classList.remove('active');

        // Reset form and go back to step 1
        resetForm();
    });

    // Helper Functions
    function goToNextStep() {
        if (currentStep < 3) {
            // Hide current form
            document.getElementById(`step${currentStep}-form`).classList.remove('active');

            // Update timeline
            timelineSteps[currentStep - 1].classList.add('completed');

            // Increment step
            currentStep++;

            // Show next form
            document.getElementById(`step${currentStep}-form`).classList.add('active');

            // Update timeline
            timelineSteps[currentStep - 1].classList.add('active');

            // If it's the confirmation step, populate the data
            if (currentStep === 3) {
                populateConfirmationData();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            // Hide current form
            document.getElementById(`step${currentStep}-form`).classList.remove('active');

            // Update timeline
            timelineSteps[currentStep - 1].classList.remove('active');

            // Decrement step
            currentStep--;

            // Show previous form
            document.getElementById(`step${currentStep}-form`).classList.add('active');

            // Update timeline
            timelineSteps[currentStep - 1].classList.add('active');
            timelineSteps[currentStep].classList.remove('completed');

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function validateCurrentStep() {
        let isValid = true;

        if (currentStep === 1) {
            // Validate Step 1
            const startingPoint = document.getElementById('starting-point').value;
            const destinationPoint = document.getElementById('destination-point').value;
            const journeyDate = document.getElementById('journey-date').value;
            const journeyTime = document.getElementById('journey-time').value;
            const vehicleType = document.getElementById('vehicle-type').value;

            if (!startingPoint || !destinationPoint || !journeyDate || !journeyTime || !vehicleType) {
                alert('Please fill in all required fields');
                isValid = false;
            }

            // If 4-wheeler is selected, validate seating capacity
            if (vehicleType === '4-wheeler') {
                const seatingCapacity = document.getElementById('seating-capacity').value;
                const seatPrice = document.getElementById('seat-price').value;

                if (!seatingCapacity) {
                    alert('Please select a seating capacity');
                    isValid = false;
                }

                if (!seatPrice) {
                    alert('Please enter a price per seat');
                    isValid = false;
                }
            }
        } else if (currentStep === 2) {
            // Validate Step 2
            const vehicleName = document.getElementById('vehicle-name').value;
            const vehicleBrand = document.getElementById('vehicle-brand').value;
            const vehicleModel = document.getElementById('vehicle-model').value;
            const vehicleColor = document.getElementById('vehicle-color').value;
            const numberPlate = document.getElementById('number-plate').value;

            if (!vehicleName || !vehicleBrand || !vehicleModel || !vehicleColor || !numberPlate) {
                alert('Please fill in all required fields');
                isValid = false;
            }

            // Check if at least one image is uploaded
            if (!formData.images.vehicleImage && !formData.images.licenseImage && !formData.images.driverPhoto) {
                alert('Please upload at least one image');
                isValid = false;
            }
        }

        return isValid;
    }

    function saveCurrentStepData() {
        if (currentStep === 1) {
            // Save Step 1 data
            formData.route = {
                startingPoint: document.getElementById('starting-point').value,
                destinationPoint: document.getElementById('destination-point').value,
                journeyDate: document.getElementById('journey-date').value,
                journeyTime: document.getElementById('journey-time').value,
                vehicleType: document.getElementById('vehicle-type').value,
                seatingCapacity: document.getElementById('seating-capacity').value,
                availableSeats: document.getElementById('seat-count').value,
                seatPrice: document.getElementById('seat-price').value,
                additionalNote: document.getElementById('additional-note').value
            };
        } else if (currentStep === 2) {
            // Save Step 2 data
            formData.vehicle = {
                vehicleName: document.getElementById('vehicle-name').value,
                vehicleBrand: document.getElementById('vehicle-brand').value,
                vehicleModel: document.getElementById('vehicle-model').value,
                vehicleColor: document.getElementById('vehicle-color').value,
                numberPlate: document.getElementById('number-plate').value
            };
        }
    }

    function populateConfirmationData() {
        // Route Details
        document.getElementById('confirm-starting-point').textContent = formData.route.startingPoint;
        document.getElementById('confirm-destination').textContent = formData.route.destinationPoint;

        const formattedDate = new Date(formData.route.journeyDate + 'T' + formData.route.journeyTime).toLocaleString();
        document.getElementById('confirm-datetime').textContent = formattedDate;

        // Vehicle Type
        let vehicleTypeText = formData.route.vehicleType === '2-wheeler' ? '2-Wheeler (Bike)' : '4-Wheeler (Car)';
        document.getElementById('confirm-vehicle-type').textContent = vehicleTypeText;

        // Vehicle Details
        const vehicleDetails = `${formData.vehicle.vehicleName} - ${formData.vehicle.vehicleBrand} ${formData.vehicle.vehicleModel} (${formData.vehicle.vehicleColor})`;
        document.getElementById('confirm-vehicle-details').textContent = vehicleDetails;
        document.getElementById('confirm-number-plate').textContent = formData.vehicle.numberPlate;

        // Seat & Price Details
        if (formData.route.vehicleType === '4-wheeler') {
            document.getElementById('confirm-seating-capacity').textContent = formData.route.seatingCapacity + ' Seater';
            document.getElementById('confirm-available-seats').textContent = formData.route.availableSeats;
            document.getElementById('confirm-price').textContent = '₹' + formData.route.seatPrice + ' per seat';
        } else {
            document.getElementById('confirm-seating-capacity').textContent = '1 Seater';
            document.getElementById('confirm-available-seats').textContent = '1';
            document.getElementById('confirm-price').textContent = 'N/A';
        }

        // Images
        if (formData.images.vehicleImage) {
            const imgElement = document.createElement('img');
            imgElement.src = formData.images.vehicleImage;
            document.getElementById('confirm-vehicle-image').innerHTML = '';
            document.getElementById('confirm-vehicle-image').appendChild(imgElement);
        }

        if (formData.images.licenseImage) {
            const imgElement = document.createElement('img');
            imgElement.src = formData.images.licenseImage;
            document.getElementById('confirm-license-image').innerHTML = '';
            document.getElementById('confirm-license-image').appendChild(imgElement);
        }

        if (formData.images.driverPhoto) {
            const imgElement = document.createElement('img');
            imgElement.src = formData.images.driverPhoto;
            document.getElementById('confirm-driver-photo').innerHTML = '';
            document.getElementById('confirm-driver-photo').appendChild(imgElement);
        }
    }

    function handleFileUpload(fileInput, previewContainer) {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Create preview
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-image" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                previewContainer.style.display = 'block';

                // Hide upload area
                const uploadArea = fileInput.parentElement;
                uploadArea.style.display = 'none';

                // Save image to form data
                const inputId = fileInput.id;
                if (inputId === 'vehicle-image') {
                    formData.images.vehicleImage = e.target.result;
                } else if (inputId === 'license-image') {
                    formData.images.licenseImage = e.target.result;
                } else if (inputId === 'driver-photo') {
                    formData.images.driverPhoto = e.target.result;
                }

                // Add remove button functionality
                const removeButton = previewContainer.querySelector('.remove-image');
                removeButton.addEventListener('click', function () {
                    // Clear file input
                    fileInput.value = '';

                    // Hide preview
                    previewContainer.style.display = 'none';

                    // Show upload area
                    uploadArea.style.display = 'flex';

                    // Remove from form data
                    if (inputId === 'vehicle-image') {
                        formData.images.vehicleImage = null;
                    } else if (inputId === 'license-image') {
                        formData.images.licenseImage = null;
                    } else if (inputId === 'driver-photo') {
                        formData.images.driverPhoto = null;
                    }
                });
            };

            reader.readAsDataURL(fileInput.files[0]);
        }
    }

    function resetForm() {
        // Reset form data
        formData = {
            route: {},
            vehicle: {},
            images: {}
        };

        // Reset all forms
        document.querySelectorAll('form').forEach(form => {
            form.reset();
        });

        // Hide all forms except step 1
        document.querySelectorAll('.step-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById('step1-form').classList.add('active');

        // Reset timeline
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) {
                step.classList.add('active');
            }
        });

        // Reset vehicle type selection
        document.querySelectorAll('.selection-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Hide conditional sections
        document.getElementById('seating-options').classList.add('hidden');
        document.getElementById('available-seats').classList.add('hidden');
        document.getElementById('price-per-seat').classList.add('hidden');

        // Reset image previews
        document.querySelectorAll('.image-preview').forEach(preview => {
            preview.style.display = 'none';
            preview.innerHTML = '';
        });

        // Show file upload areas
        document.querySelectorAll('.file-upload-area').forEach(area => {
            area.style.display = 'flex';
        });

        // Reset current step
        currentStep = 1;
    }
});