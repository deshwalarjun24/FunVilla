// Cloud Game Script
document.addEventListener('DOMContentLoaded', function() {
  // Game elements
  const playButton = document.getElementById('play-cloud-game');
  const gameOverlay = document.getElementById('game-overlay');
  const pauseButton = document.getElementById('pause-game');
  const backButton = document.getElementById('back-to-home');
  const gameScoreValue = document.getElementById('game-score-value');
  const gameContainer = document.getElementById('game-container');
  const gameCloudsContainer = document.querySelector('.game-clouds');
  
  // Game state variables
  let gameActive = false;
  let gamePaused = false;
  let score = 0;
  let cloudInterval;
  let autoCloudGenerationEnabled = true;
  const maxClouds = 5;
  const absoluteMaxClouds = 20;
  
  // Cloud image paths
  const cloudImages = [
    'Images/Cloud/Cloud1.png',
    'Images/Cloud/cloud2.png',
    'Images/Cloud/cloud3.png', 
    'Images/Cloud/cloud4.png',
    'Images/Cloud/cloud5.png',
    'Images/Cloud/cloud6.png',
    'Images/Cloud/cloud7.png'
  ];
  
  // Probability settings for special clouds (as percentages)
  const negativeCloudProbability = 5; // 5% chance for negative cloud (cloud3) to spawn
  
  // Play button click event
  playButton.addEventListener('click', startGame);
  
  // Pause button click event
  pauseButton.addEventListener('click', togglePause);
  
  // Back button click event
  backButton.addEventListener('click', endGame);
  
  // Function to start the game
  function startGame() {
    // Show game overlay
    gameOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
    
    // Reset score
    score = 0;
    updateGameScore();
    
    // Set game as active
    gameActive = true;
    gamePaused = false;
    
    // Clear any existing clouds in the game container
    while (gameCloudsContainer.firstChild) {
      gameCloudsContainer.removeChild(gameCloudsContainer.firstChild);
    }
    
    // Add game instructions
    showGameInstructions();
    
    // Create initial set of clouds
    const initialClouds = Math.min(maxClouds, absoluteMaxClouds);
    for (let i = 0; i < initialClouds; i++) {
      createGameCloud();
    }
    
    // Start automatic cloud creation
    startCloudGeneration();
  }
  
  // Function to toggle pause state
  function togglePause() {
    if (gameActive) {
      gamePaused = !gamePaused;
      
      if (gamePaused) {
        // Pause the game
        pauseButton.textContent = 'Resume';
        clearInterval(cloudInterval);
        
        // Pause all cloud animations
        const clouds = gameCloudsContainer.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
          cloud.style.animationPlayState = 'paused';
        });
      } else {
        // Resume the game
        pauseButton.textContent = 'Pause';
        startCloudGeneration();
        
        // Resume all cloud animations
        const clouds = gameCloudsContainer.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
          cloud.style.animationPlayState = 'running';
        });
      }
    }
  }
  
  // Function to end the game
  function endGame() {
    // Hide game overlay
    gameOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // Set game as inactive
    gameActive = false;
    gamePaused = false;
    
    // Clear automatic cloud creation
    clearInterval(cloudInterval);
    
    // Reset pause button text
    pauseButton.textContent = 'Pause';
    
    // Clear all clouds in the game container
    while (gameCloudsContainer.firstChild) {
      gameCloudsContainer.removeChild(gameCloudsContainer.firstChild);
    }
  }
  
  // Function to start cloud generation
  function startCloudGeneration() {
    // Clear any existing interval
    clearInterval(cloudInterval);
    
    // Set new interval
    const cloudIntervalTime = window.innerWidth <= 768 ? 2500 : 2000; // Slightly slower on mobile
    cloudInterval = setInterval(function() {
      if (!gamePaused && gameActive) {
        // Check current cloud count
        const currentClouds = gameCloudsContainer.querySelectorAll('.cloud').length;
        
        // Only create a new cloud if we're below the maximum
        if (currentClouds < absoluteMaxClouds) {
          autoCloudGenerationEnabled = true;
        } else {
          autoCloudGenerationEnabled = false;
        }
        
        // Only create a new cloud if auto generation is enabled
        if (autoCloudGenerationEnabled) {
          createGameCloud();
        }
      }
    }, cloudIntervalTime);
  }
  
  // Add event delegation for cloud clicks in the game container
  gameCloudsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('cloud') && gameActive && !gamePaused) {
      const cloudSrc = e.target.src;
      
      // Prevent multiple clicks on the same cloud
      if (e.target.classList.contains('cloud-destroy')) return;
      
      // Create a pop effect at click position
      createPopEffect(e.clientX, e.clientY);
      
      // Check if it's a negative cloud (cloud3)
      if (cloudSrc.includes('cloud3.png')) {
        // Calculate negative points based on cloud size
        const cloudWidth = parseFloat(e.target.style.width) || 100;
        const points = -Math.round(300 / cloudWidth * 10); // Negative points
        
        // Update score with negative points
        updateScore(points);
        
        // Show floating negative points
        showFloatingPoints(e.clientX, e.clientY, points, false);
        
        // Add immediate visual feedback - Improved for instant destruction
        e.target.classList.add('cloud-destroy');
        
        // Remove cloud immediately and create a new one
        destroyAndReplaceGameCloud(e.target);
      }
      // Regular cloud processing
      else {
        // Calculate points based on cloud size (smaller clouds = more points)
        const cloudWidth = parseFloat(e.target.style.width) || 100;
        const points = Math.round(300 / cloudWidth * 10);
        
        // Update score
        updateScore(points);
        
        // Show floating points
        showFloatingPoints(e.clientX, e.clientY, points, false);
        
        // Add immediate visual feedback - Improved for instant destruction
        e.target.classList.add('cloud-destroy');
        
        // Remove cloud immediately and create a new one
        destroyAndReplaceGameCloud(e.target);
      }
    }
  });
  
  // For touch devices
  gameCloudsContainer.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('cloud') && gameActive && !gamePaused) {
      const cloudSrc = e.target.src;
      const touch = e.touches[0];
      
      // Prevent multiple touches on the same cloud
      if (e.target.classList.contains('cloud-destroy')) return;
      
      // Create a pop effect at touch position
      createPopEffect(touch.clientX, touch.clientY);
      
      // Check if it's a negative cloud (cloud3)
      if (cloudSrc.includes('cloud3.png')) {
        // Calculate negative points based on cloud size
        const cloudWidth = parseFloat(e.target.style.width) || 100;
        const points = -Math.round(300 / cloudWidth * 10); // Negative points
        
        // Update score with negative points
        updateScore(points);
        
        // Show floating negative points
        showFloatingPoints(touch.clientX, touch.clientY, points, false);
        
        // Add immediate visual feedback - Improved for instant destruction
        e.target.classList.add('cloud-destroy');
        
        // Remove cloud immediately and create a new one
        destroyAndReplaceGameCloud(e.target);
      }
      // Regular cloud processing
      else {
        // Calculate points based on cloud size (smaller clouds = more points)
        const cloudWidth = parseFloat(e.target.style.width) || 100;
        const points = Math.round(300 / cloudWidth * 10);
        
        // Update score
        updateScore(points);
        
        // Show floating points at touch position
        showFloatingPoints(touch.clientX, touch.clientY, points, false);
        
        // Add immediate visual feedback - Improved for instant destruction
        e.target.classList.add('cloud-destroy');
        
        // Remove cloud immediately and create a new one
        destroyAndReplaceGameCloud(e.target);
      }
      
      e.preventDefault(); // Prevent default touch behavior
    }
  });
  
  // Function to update score
  function updateScore(points) {
    score += points;
    updateGameScore();
    
    // Add score animation effect
    gameScoreValue.classList.add('score-update');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      gameScoreValue.classList.remove('score-update');
    }, 500);
  }
  
  // Function to update the game score display
  function updateGameScore() {
    gameScoreValue.textContent = score;
  }
  
  // Function to show floating points when clicking a cloud
  function showFloatingPoints(x, y, points, isBonus) {
    const pointsElement = document.createElement('div');
    const prefix = points >= 0 ? '+' : ''; // Only show '+' for positive points
    
    // Change text based on whether it's a bonus or not
    if (isBonus) {
      pointsElement.textContent = `MEGA BONUS! ${prefix}${points}`;
      pointsElement.style.color = '#FFD700'; // Gold color for bonus
      pointsElement.style.fontSize = window.innerWidth <= 768 ? '24px' : '32px'; // Larger text for bonus
    } else {
      pointsElement.textContent = `${prefix}${points}`;
      pointsElement.style.color = points >= 0 ? '#4CAF50' : '#FF5252'; // Green for positive, red for negative
      pointsElement.style.fontSize = window.innerWidth <= 768 ? '18px' : '22px';
    }
    
    pointsElement.style.position = 'fixed';
    pointsElement.style.left = `${x}px`;
    pointsElement.style.top = `${y}px`;
    pointsElement.style.fontWeight = 'bold';
    pointsElement.style.pointerEvents = 'none';
    pointsElement.style.zIndex = '10000';
    pointsElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    pointsElement.style.fontFamily = "'Bubblegum Sans', cursive";
    pointsElement.style.transition = 'all 0.5s ease-out';
    pointsElement.style.opacity = '1';
    
    document.body.appendChild(pointsElement);
    
    // Animate the floating points with a more dynamic animation
    setTimeout(() => {
      pointsElement.style.transform = `translateY(-80px) scale(1.2)`;
      pointsElement.style.opacity = '0';
      
      // Add a slight random horizontal movement
      const randomX = (Math.random() * 40) - 20; // Random value between -20 and 20
      pointsElement.style.left = `${parseInt(pointsElement.style.left) + randomX}px`;
      
      // Remove after animation completes
      setTimeout(() => {
        pointsElement.remove();
      }, 500);
    }, 50);
  }
  
  // Function to create a pop effect at the click/touch position
  function createPopEffect(x, y) {
    const popEffect = document.createElement('div');
    popEffect.className = 'pop-effect';
    popEffect.style.left = `${x}px`;
    popEffect.style.top = `${y}px`;
    document.body.appendChild(popEffect);
    
    // Remove the pop effect after animation completes
    setTimeout(() => {
      popEffect.remove();
    }, 300);
  }
  
  // Function to destroy cloud and create a new one in the game
  function destroyAndReplaceGameCloud(cloud) {
    // Play a pop sound if available
    playPopSound();
    
    // Remove the cloud after a very short delay (just enough for the animation to start)
    setTimeout(() => {
      cloud.remove();
      
      // Check if we're below the maximum limit before creating a new cloud
      const currentClouds = gameCloudsContainer.querySelectorAll('.cloud').length;
      if (currentClouds < absoluteMaxClouds && gameActive && !gamePaused) {
        // Only create a new cloud if we're below the maximum
        createGameCloud();
      }
    }, 30); // Very short delay, just enough for the animation to be visible
  }
  
  // Function to play a pop sound
  function playPopSound() {
    // Create a simple pop sound using the Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Silently fail if audio context is not supported
      console.log("Audio not supported");
    }
  }
  
  // Function to create a new cloud in the game
  function createGameCloud() {
    // Check if we already have the maximum number of clouds
    const currentClouds = gameCloudsContainer.querySelectorAll('.cloud').length;
    if (currentClouds >= absoluteMaxClouds || !gameActive || gamePaused) {
      autoCloudGenerationEnabled = false; // Ensure auto generation is disabled
      return; // Don't create more clouds if we've reached the limit or game is not active
    }
    
    const cloud = document.createElement('img');
    cloud.classList.add('cloud', 'cloud-spawn');
    
    // Determine if this should be a special cloud
    const randomValue = Math.random() * 100;
    let randomImageIndex;
    
    if (randomValue < negativeCloudProbability) {
      // Create negative cloud (cloud3)
      randomImageIndex = 2; // Index for cloud3.png
    } else {
      // Create regular cloud (any cloud except cloud3)
      do {
        randomImageIndex = Math.floor(Math.random() * cloudImages.length); // Use all available clouds
      } while (randomImageIndex === 2); // Exclude cloud3
    }
    
    cloud.src = cloudImages[randomImageIndex];
    cloud.alt = 'Cloud';
    
    // Add special visual effects for special clouds
    if (randomImageIndex === 2) { // Negative cloud
      cloud.classList.add('negative-cloud');
      // Add subtle warning animation
      cloud.style.animation = 'warningPulse 3s infinite alternate, moveCloudForward 15s linear infinite';
    } else {
      // Add subtle float animation to regular clouds
      const floatDuration = 3 + Math.random() * 2; // Random duration between 3-5s
      cloud.style.animation = `cloudFloat ${floatDuration}s infinite ease-in-out, moveCloudForward ${15 + Math.random() * 15}s linear infinite`;
    }
    
    // Responsive cloud sizing based on screen size - Increased size for better visibility
    const minSize = window.innerWidth <= 768 ? 60 : 100;  // Increased from 40/80
    const maxSize = window.innerWidth <= 768 ? 140 : 220; // Increased from 120/200
    const size = Math.random() * (maxSize - minSize) + minSize;
    cloud.style.width = `${size}px`;
    
    // Get container dimensions for random positioning
    const containerWidth = gameContainer.offsetWidth || window.innerWidth;
    const containerHeight = gameContainer.offsetHeight || window.innerHeight;
    
    // Randomly position cloud within the container
    const top = Math.random() * (containerHeight - size);
    const left = Math.random() * (containerWidth - size);
    cloud.style.top = `${top}px`;
    cloud.style.left = `${left}px`;
    
    // Improved opacity for better visibility
    if (randomImageIndex !== 2) {
      cloud.style.opacity = (Math.random() * (1.0 - 0.85) + 0.85).toString(); // Higher opacity range (0.85-1.0)
    } else if (randomImageIndex === 2) { // Negative cloud
      cloud.style.opacity = '0.95'; // Make negative cloud more visible
    }
    
    // Add drop shadow for better visibility
    cloud.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))';
    
    // Set cursor to indicate clickable
    cloud.style.cursor = 'pointer';
    
    // Add to container
    gameCloudsContainer.appendChild(cloud);
  }
  
  // Make clouds responsive to window resize
  window.addEventListener('resize', function() {
    if (gameActive) {
      // Clear all clouds and recreate them with appropriate sizing for the new screen size
      const existingClouds = gameCloudsContainer.querySelectorAll('.cloud');
      existingClouds.forEach(cloud => cloud.remove());
      
      // Recreate initial clouds, but respect the maximum limit
      const cloudsToCreate = Math.min(maxClouds, absoluteMaxClouds);
      for (let i = 0; i < cloudsToCreate; i++) {
        createGameCloud();
      }
    }
  });
  
  // Function to show game instructions
  function showGameInstructions() {
    const instructionsElement = document.createElement('div');
    instructionsElement.className = 'game-instructions';
    instructionsElement.innerHTML = `
      <div class="instructions-content">
        <h3>Pop the Clouds!</h3>
        <p>Click or tap on clouds to pop them and earn points.</p>
        <p>Smaller clouds = More points!</p>
        <p><span class="warning-text">Warning:</span> Red clouds will deduct points!</p>
      </div>
    `;
    
    gameContainer.appendChild(instructionsElement);
    
    // Fade out instructions after a few seconds
    setTimeout(() => {
      instructionsElement.style.opacity = '0';
      setTimeout(() => {
        instructionsElement.remove();
      }, 1000);
    }, 4000);
  }
  
  // Add CSS for the special cloud animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes warningPulse {
      0% { filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)); }
      100% { filter: brightness(1.3) sepia(0.3) drop-shadow(0 0 15px rgba(255, 100, 100, 0.7)); }
    }
    
    .score-update {
      animation: scoreUpdate 0.5s ease-out;
    }
    
    @keyframes scoreUpdate {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes cloudDestroy {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
      100% { transform: scale(0); opacity: 0; }
    }
    
    .cloud-destroy {
      animation: cloudDestroy 0.08s ease-out forwards;
      pointer-events: none;
    }
    
    @keyframes cloudSpawn {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .cloud-spawn {
      animation: cloudSpawn 0.3s ease-out forwards;
    }
    
    @keyframes cloudPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes cloudFloat {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
    
    @keyframes moveCloudForward {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(100vw + 300px)); }
    }
    
    .negative-cloud {
      filter: hue-rotate(320deg) saturate(1.5) drop-shadow(0 0 15px rgba(255, 100, 100, 0.7));
      transform: scale(1.05);
      z-index: 10;
      animation: cloudPulse 2s infinite ease-in-out;
    }
    
    .cloud {
      transition: transform 0.2s ease;
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'), auto;
    }
    
    .cloud:hover {
      transform: scale(1.1);
      filter: brightness(1.1) drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
    }
    
    .negative-cloud:hover {
      transform: scale(1.15);
      filter: hue-rotate(320deg) saturate(1.7) brightness(1.1) drop-shadow(0 0 20px rgba(255, 100, 100, 0.8));
    }
    
    .game-instructions {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      text-align: center;
      z-index: 10002;
      transition: opacity 1s ease;
      pointer-events: none;
    }
    
    .instructions-content h3 {
      font-family: 'Bubblegum Sans', cursive;
      font-size: 2rem;
      margin-bottom: 15px;
      color: #fff;
    }
    
    .instructions-content p {
      font-family: 'Comic Neue', cursive;
      font-size: 1.2rem;
      margin-bottom: 10px;
    }
    
    .warning-text {
      color: #ff5252;
      font-weight: bold;
    }
    
    @media (max-width: 768px) {
      .game-instructions {
        width: 80%;
        padding: 15px;
      }
      
      .instructions-content h3 {
        font-size: 1.5rem;
      }
      
      .instructions-content p {
        font-size: 1rem;
      }
    }
    
    @keyframes popEffect {
      0% { transform: scale(0); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.7; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    .pop-effect {
      position: fixed;
      width: 50px;
      height: 50px;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10000;
      animation: popEffect 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}); 