let timeOnPage = 0;
        let countdownValue = 30;
        let chaosLevel = 0;
        let typewriterActive = false;
        let cursedWordInterval;
        let fontSwitchInterval;
        let blinkInterval;
        let mobileEyeIntervals = [];
        let lastTouchTime = 0;
        
        const cursedFonts = [
            "'Courier Prime', monospace",
            "'Comic Neue', cursive",
            "'Creepster', cursive", 
            "'Nosifer', cursive",
            "Impact, sans-serif",
            "'Times New Roman', serif",
            "Arial Black, sans-serif",
            "Georgia, serif",
            "Verdana, sans-serif",
            "'Brush Script MT', cursive"
        ];
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        let eyeTrackingActive = false;
        
        const messages = [
            "You shouldn't have come here...",
            "This page wasn't meant for you...",
            "Why are you still here?",
            "LEAVE NOW WHILE YOU STILL CAN",
            "The website remembers you...",
            "You're not supposed to see this...",
            "Error 404: Soul not found",
            "The void stares back...",
            "You've been here too long...",
            "ESCAPE IS IMPOSSIBLE",
            "The server is hungry...",
            "Your presence has been... noted.",
            "404: Reality not found",
            "The machine is learning your patterns...",
            "You should have left when you had the chance"
        ];
        
        const cursedWords = [
            "DAMNED", "NO ESCAPE", "404'd", "CORRUPTED", "TERMINAL", 
            "VOID", "GLITCH", "ERROR", "SYSTEM FAILURE", "DELETED",
            "TERMINATED", "ACCESS DENIED", "FORBIDDEN", "LOST", "DOOMED"
        ];
        
        let currentMessageIndex = 0;
        
        function typeWriter(text, element, callback) {
            if (typewriterActive) return;
            typewriterActive = true;
            
            let i = 0;
            element.textContent = "";
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50 + Math.random() * 100);
                } else {
                    typewriterActive = false;
                    if (callback) callback();
                }
            }
            type();
        }
        
        function showNextMessage() {
            const messageElement = document.getElementById('typewriter');
            const message = messages[currentMessageIndex];
            
            typeWriter(message, messageElement, () => {
                setTimeout(() => {
                    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
                    setTimeout(showNextMessage, 2000 + Math.random() * 3000);
                }, 3000);
            });
        }
        
        function updateCountdown() {
            const countdownElement = document.getElementById('countdown');
            countdownValue--;
            
            if (countdownValue <= 0) {
                countdownElement.textContent = "0";
                triggerChaos();
                return;
            }
            
            countdownElement.textContent = countdownValue.toString();
        }
        
        function blinkEye(eye) {
            eye.classList.add('blink');
            setTimeout(() => {
                eye.classList.remove('blink');
            }, 150);
        }
        
        function randomEyeBlink() {
            const visibleEyes = document.querySelectorAll('.eye:not(.hidden)');
            if (visibleEyes.length > 0) {
                const randomEye = visibleEyes[Math.floor(Math.random() * visibleEyes.length)];
                blinkEye(randomEye);
                
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        const anotherEye = visibleEyes[Math.floor(Math.random() * visibleEyes.length)];
                        if (anotherEye !== randomEye) {
                            blinkEye(anotherEye);
                        }
                    }, 50);
                }
            }
        }
        
        function moveEyeRandomly(eye) {
            const randomX = (Math.random() - 0.5) * 20; // -10 to 10px
            const randomY = (Math.random() - 0.5) * 20; // -10 to 10px
            
            eye.style.setProperty('--pupil-x', randomX + 'px');
            eye.style.setProperty('--pupil-y', randomY + 'px');
        }
        
        function startMobileEyeMovement() {
            const eyes = document.querySelectorAll('.eye:not(.hidden)');
            
            document.getElementById('mobile-warning').style.opacity = '1';
            
            eyes.forEach((eye, index) => {
                // Each eye gets a different phase delay (0ms, 250ms, 500ms, 750ms)
                const phaseDelay = index * 250;
                
                setTimeout(() => {
                    moveEyeRandomly(eye);
                    
                    const interval = setInterval(() => {
                        moveEyeRandomly(eye);
                    }, 1000); // Move every second
                    
                    mobileEyeIntervals.push(interval);
                }, phaseDelay);
            });
        }
        
        function switchFont() {
            const randomFont = cursedFonts[Math.floor(Math.random() * cursedFonts.length)];
            document.body.style.fontFamily = randomFont;
            
            if (Math.random() < 0.3) {
                const cursedColors = ['#00ff00', '#ff0000', '#ffff00', '#ff00ff', '#00ffff'];
                document.body.style.color = cursedColors[Math.floor(Math.random() * cursedColors.length)];
            }
        }
        
        function spawnCursedWord() {
            const word = cursedWords[Math.floor(Math.random() * cursedWords.length)];
            const element = document.createElement('div');
            element.className = 'cursed-word';
            element.textContent = word;
            
            element.style.left = Math.random() * 80 + '%';
            element.style.top = Math.random() * 80 + '%';
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        }
        
        function increaseChaos() {
            chaosLevel++;
            timeOnPage++;
            
            if (timeOnPage === 3) {
                document.getElementById('warning').style.opacity = '1';
            }
            
            if (timeOnPage === 5) {
                document.querySelector('.eye3').classList.remove('hidden');
                document.querySelector('.eye4').classList.remove('hidden');
                
                if (isMobile) {
                    startAdditionalMobileEyes();
                }
            }
                        
            if (timeOnPage === 15) {
                document.querySelector('.title').classList.add('glitch');
            }
            
            if (timeOnPage === 10) {
                fontSwitchInterval = setInterval(switchFont, 5000);
            }
            
            if (timeOnPage % 5 === 0) {
                clearInterval(cursedWordInterval);
                const frequency = Math.max(800 - (chaosLevel * 100), 300);
                cursedWordInterval = setInterval(spawnCursedWord, frequency);
            }
        }
        
        function triggerChaos() {
            document.getElementById('overlay').classList.add('active');
            
            document.body.classList.add('chaos-mode');
            
            clearInterval(fontSwitchInterval);
            fontSwitchInterval = setInterval(switchFont, 500);
            
            for (let i = 0; i < 20; i++) {
                setTimeout(spawnCursedWord, i * 100);
            }
            
            setTimeout(() => {
                document.querySelector('.title').textContent = "YOU SHOULD HAVE LEFT";
            }, 2000);
            
            setTimeout(() => {
                document.getElementById('typewriter').textContent = "It's too late now...";
            }, 4000);
            
            clearInterval(blinkInterval);
            blinkInterval = setInterval(randomEyeBlink, 300);
            
            if (isMobile) {
                mobileEyeIntervals.forEach(clearInterval);
                mobileEyeIntervals = [];
                
                const eyes = document.querySelectorAll('.eye:not(.hidden)');
                eyes.forEach(eye => {
                    const interval = setInterval(() => {
                        moveEyeRandomly(eye);
                    }, 300);
                    mobileEyeIntervals.push(interval);
                });
            }
        }
        
        function handleEyeTracking(event) {
            const eyes = document.querySelectorAll('.eye:not(.hidden)');
            eyes.forEach(eye => {
                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;
                
                const deltaX = event.clientX - eyeCenterX;
                const deltaY = event.clientY - eyeCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = 22; // Maximum distance pupil can move from center
                
                const pupilDistance = Math.min(distance / 4, maxDistance);
                const angle = Math.atan2(deltaY, deltaX);
                const pupilX = Math.cos(angle) * pupilDistance;
                const pupilY = Math.sin(angle) * pupilDistance;
                
                eye.style.setProperty('--pupil-x', pupilX + 'px');
                eye.style.setProperty('--pupil-y', pupilY + 'px');
            });
        }
        
        function handleTouchInteraction(event) {
            event.preventDefault();
            const now = Date.now();
            
            // Prevent too many touch events at once
            if (now - lastTouchTime < 200) return;
            lastTouchTime = now;
            
            if (event.touches && event.touches[0]) {
                const touch = event.touches[0];
                const fakeMouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                handleEyeTracking(fakeMouseEvent);
            }
            
            if (Math.random() > 0.7) {
                spawnCursedWord();
            }
        }
        
        // Initialize
        function init() {
            showNextMessage();
            
            setInterval(updateCountdown, 1000);
            setInterval(increaseChaos, 1000);
            
            cursedWordInterval = setInterval(spawnCursedWord, 2000);
            
            blinkInterval = setInterval(randomEyeBlink, 3000);
            
            if (isMobile) {
                startInitialMobileEyes(); 
                document.addEventListener('touchmove', handleTouchInteraction);
                document.addEventListener('touchstart', handleTouchInteraction);
            } else {
                document.addEventListener('mousemove', handleEyeTracking);
            }
            
            window.addEventListener('beforeunload', (e) => {
                e.preventDefault();
                e.returnValue = 'The page doesn\'t want you to leave...';
            });
        }
        
        window.onload = init;

        function startMovingEye(eye, delay) {
            setTimeout(() => {
                moveEyeRandomly(eye);
                const interval = setInterval(() => {
                    moveEyeRandomly(eye);
                }, 1000);
                mobileEyeIntervals.push(interval);
            }, delay);
        }
        
        function startInitialMobileEyes() {
            const initialEyes = document.querySelectorAll('.eye:not(.hidden)');
            
            document.getElementById('mobile-warning').style.opacity = '1';
            
            initialEyes.forEach((eye, index) => {
                // Each eye gets a different phase delay (0ms, 250ms, etc.)
                const phaseDelay = index * 250;
                startMovingEye(eye, phaseDelay);
            });
        }

        function startAdditionalMobileEyes() {
            const newEyes = document.querySelectorAll('.eye3, .eye4');
            
            newEyes.forEach((eye, index) => {
                // Continue the phase pattern (500ms, 750ms for new eyes)
                const phaseDelay = (index + 2) * 250; // +2 to continue from previous eyes
                startMovingEye(eye, phaseDelay);
            });
        }

