// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const overlay = document.getElementById('overlay');
  const menuLinks = document.querySelectorAll('.menu a');

  // Toggle menu when hamburger is clicked
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Close menu when overlay is clicked
  overlay.addEventListener('click', function() {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Cloud Game Controls
  const playButton = document.getElementById('play-cloud-game');
  const gameOverlay = document.getElementById('game-overlay');
  const pauseButton = document.getElementById('pause-game');
  const backButton = document.getElementById('back-to-home');
  const gameScoreValue = document.getElementById('game-score-value');
  
  let gameActive = false;
  let gamePaused = false;
  let gameScore = 0;
  
  // Play button click event
  if (playButton) {
    playButton.addEventListener('click', function() {
      // Show game overlay
      gameOverlay.classList.add('active');
      document.body.classList.add('no-scroll');
      
      // Reset score
      gameScore = 0;
      gameScoreValue.textContent = gameScore;
      
      // Set game as active
      gameActive = true;
      gamePaused = false;
    });
  }
  
  // Pause button click event
  if (pauseButton) {
    pauseButton.addEventListener('click', function() {
      if (gameActive) {
        gamePaused = !gamePaused;
        
        if (gamePaused) {
          // Pause the game
          pauseButton.textContent = 'Resume';
          
          // Pause all cloud animations
          const clouds = document.querySelectorAll('.game-clouds .cloud');
          clouds.forEach(cloud => {
            cloud.style.animationPlayState = 'paused';
          });
        } else {
          // Resume the game
          pauseButton.textContent = 'Pause';
          
          // Resume all cloud animations
          const clouds = document.querySelectorAll('.game-clouds .cloud');
          clouds.forEach(cloud => {
            cloud.style.animationPlayState = 'running';
          });
        }
      }
    });
  }
  
  // Back button click event
  if (backButton) {
    backButton.addEventListener('click', function() {
      // Hide game overlay
      gameOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Set game as inactive
      gameActive = false;
      gamePaused = false;
      
      // Reset pause button text
      pauseButton.textContent = 'Pause';
    });
  }

  // Add scroll event listener for transparent navbar
  const header = document.querySelector('header');
  
  // Function to handle scroll event
  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Call once on page load to set initial state
  handleScroll();

  // Ensure hero section is exactly viewport height and visible
  function adjustHeroHeight() {
    const heroSection = document.getElementById('hero');
    const heroDiv = document.querySelector('.hero');
    
    if (heroSection && heroDiv) {
      const viewportHeight = window.innerHeight;
      heroSection.style.height = `${viewportHeight}px`;
      heroDiv.style.height = `${viewportHeight}px`;
      
      // Ensure the hero section is visible
      heroSection.style.display = 'block';
      heroDiv.style.display = 'flex';
      
      // Ensure proper z-index
      heroSection.style.zIndex = '1';
      heroDiv.style.zIndex = '1';
      
      // Ensure the hero section is positioned at the top
      heroSection.style.position = 'relative';
      heroSection.style.top = '0';
      
      // Add some console logging for debugging
      console.log('Hero section adjusted:', heroSection.style.height);
    }
  }
  
  // Adjust hero height on load and resize
  window.addEventListener('load', adjustHeroHeight);
  window.addEventListener('resize', adjustHeroHeight);
  
  // Call once on DOM content loaded
  adjustHeroHeight();
});

// Live Chat JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const chatTrigger = document.getElementById('chat-trigger');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  
  // Toggle chat window
  chatTrigger.addEventListener('click', function() {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
    }
  });
  
  // Close chat window
  chatClose.addEventListener('click', function() {
    chatWindow.classList.remove('active');
  });
  
  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Add message to chat
    addMessage(message, 'sent');
    
    // Clear input
    chatInput.value = '';
    
    // Auto resize input
    autoResizeInput();
    
    // Simulate response after a short delay
    setTimeout(simulateResponse, 1000);
  }
  
  // Send message on button click
  chatSend.addEventListener('click', sendMessage);
  
  // Send message on Enter key press (but allow Shift+Enter for new line)
  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Auto resize textarea
  function autoResizeInput() {
    chatInput.style.height = 'auto';
    chatInput.style.height = (chatInput.scrollHeight) + 'px';
  }
  
  chatInput.addEventListener('input', autoResizeInput);
  
  // Add message to chat
  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'sent' ? 'message-sent' : 'message-received';
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
      </div>
      <span class="message-time">${timeString}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Simulate response
  function simulateResponse() {
    const responses = [
      "Thank you for your message! Our team will assist you shortly.",
      "I understand. Can you provide more details so I can help you better?",
      "That's a great question. Let me check and get back to you in a moment.",
      "We typically resolve this kind of issue within 24 hours.",
      "Is there anything else you would like to know?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'received');
  }
  
  // Initialize
  autoResizeInput();
});