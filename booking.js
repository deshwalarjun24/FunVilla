// Kid-friendly booking section interactions

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle - New Implementation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    
    // Toggle menu when hamburger is clicked
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Close menu when overlay is clicked
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            this.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Close menu when a link is clicked
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Explorer counter functionality
    const minusBtn = document.querySelector('.counter-btn.minus');
    const plusBtn = document.querySelector('.counter-btn.plus');
    const kidsInput = document.getElementById('kids');
    const explorerIcons = document.getElementById('explorer-icons');
    
    // Update explorer icons based on input value
    function updateExplorerIcons() {
        const count = parseInt(kidsInput.value) || 0;
        explorerIcons.innerHTML = '';
        
        const icons = ['👧', '👦'];
        for (let i = 0; i < count; i++) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'kid-icon';
            iconDiv.textContent = icons[i % icons.length];
            iconDiv.style.animationDelay = `${i * 0.2}s`;
            explorerIcons.appendChild(iconDiv);
        }
    }
    
    // Initialize explorer icons
    updateExplorerIcons();
    
    // Counter button functionality
    if (minusBtn && plusBtn && kidsInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(kidsInput.value) || 0;
            if (value > 1) {
                kidsInput.value = value - 1;
                updateExplorerIcons();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(kidsInput.value) || 0;
            if (value < 10) {
                kidsInput.value = value + 1;
                updateExplorerIcons();
            }
        });
        
        kidsInput.addEventListener('change', updateExplorerIcons);
    }
    
    // Package selection highlight effect
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a little bounce animation when clicked
            this.style.animation = 'cardBounce 0.5s';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Fun submit button effects
    const submitBtn = document.querySelector('.magic-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('mouseover', function() {
            // Create random sparkle positions
            const sparkles = this.querySelector('.sparkles');
            if (sparkles) {
                let sparkleHTML = '';
                for (let i = 0; i < 5; i++) {
                    const top = Math.floor(Math.random() * 100);
                    const left = Math.floor(Math.random() * 100);
                    sparkleHTML += `<span style="position:absolute; top:${top}%; left:${left}%;">✨</span>`;
                }
                sparkles.innerHTML = sparkleHTML;
            }
        });
        
        // Add bounce effect on hover
        submitBtn.addEventListener('mouseover', function() {
            this.style.animation = 'btnBounce 1s infinite';
        });
        
        submitBtn.addEventListener('mouseout', function() {
            this.style.animation = '';
        });
    }
    
    // Add keyframe animation for card bounce
    if (!document.getElementById('custom-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'custom-animations';
        styleSheet.textContent = `
            @keyframes cardBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes btnBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Mascot helper interaction
    const mascot = document.querySelector('.mascot-image');
    const speechBubble = document.querySelector('.speech-bubble');
    
    if (mascot && speechBubble) {
        mascot.addEventListener('click', function() {
            speechBubble.innerHTML = '<p>Fill out the form with how many explorers are coming and when you want to visit! Need more help? Call us at 555-FUN-TIME!</p>';
            
            // Return to original message after 5 seconds
            setTimeout(() => {
                speechBubble.innerHTML = '<p>Hi there, friend! Need help booking your adventure? Click me!</p>';
            }, 5000);
        });
    }
    
    // Fun meter random movement
    const funMeterNeedle = document.querySelector('.fun-meter-needle');
    
    if (funMeterNeedle) {
        setInterval(() => {
            const randomRotation = Math.floor(Math.random() * 20) - 10; // -10 to 10 degrees
            funMeterNeedle.style.transform = `rotate(${randomRotation}deg)`;
        }, 2000);
    }
    
    // Form submission
    const bookForm = document.getElementById('book-form');
    
    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const package = document.querySelector('input[name="package"]:checked')?.value || 'basic';
            const date = document.getElementById('visit-date').value;
            const time = document.getElementById('time-slot').value;
            const kidCount = document.getElementById('kids').value;
            const parentName = document.getElementById('parent-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const wishes = document.getElementById('special-wishes').value;
            
            // Simple validation
            if (!date || !time || !parentName || !email || !phone) {
                alert('Please fill out all the required fields for your adventure!');
                return;
            }
            
            // Show booking confirmation
            const ticketDesign = document.querySelector('.ticket-design');
            if (ticketDesign) {
                const packageNames = {
                    'basic': 'Basic Fun',
                    'super': 'Super Fun',
                    'mega': 'Mega Fun'
                };
                
                const confirmationHTML = `
                    <div class="confirmation-message">
                        <h3 class="ticket-title">Woohoo! Your Adventure is Booked!</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 5rem; margin-bottom: 10px;">🎉</div>
                            <p style="font-family: 'Comic Neue', cursive; font-size: 1.2rem; color: #5f6caf;">
                                Thanks, ${parentName}! We've sent your magic tickets to ${email}.
                            </p>
                            <div style="background-color: #f5f7fa; border-radius: 10px; padding: 15px; margin: 20px 0; text-align: left;">
                                <h4 style="color: #ff6b6b; font-family: 'Bubblegum Sans', cursive;">Your Adventure Details:</h4>
                                <p><strong>Package:</strong> ${packageNames[package]}</p>
                                <p><strong>Date:</strong> ${date}</p>
                                <p><strong>Time:</strong> ${time}</p>
                                <p><strong>Explorers:</strong> ${kidCount}</p>
                                ${wishes ? `<p><strong>Special Wishes:</strong> ${wishes}</p>` : ''}
                            </div>
                            <p style="color: #5f6caf; font-weight: bold;">See you soon for maximum fun!</p>
                        </div>
                        <button class="magic-btn" id="book-another">
                            <span class="btn-text">Book Another Adventure</span>
                        </button>
                    </div>
                `;
                
                ticketDesign.innerHTML = confirmationHTML;
                
                // Add event listener to "Book Another" button
                const bookAnother = document.getElementById('book-another');
                if (bookAnother) {
                    bookAnother.addEventListener('click', function() {
                        location.reload();
                    });
                }
            }
        });
    }
    
    // Set minimum date to today
    const visitDateInput = document.getElementById('visit-date');
    if (visitDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        
        visitDateInput.min = `${yyyy}-${mm}-${dd}`;
    }
    function paymentgayway()
    {
        window.location.href = "Payment_Gateway.html";
    }
});