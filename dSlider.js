// Slider Variables and Initialization
let currentPosition = 0;
const sliderWrapper = document.getElementById('sliderWrapper');
const standardCardWidth = 300 + 8; // 300px width + 4px margin on both sides
const halfCardWidth = 150 + 8; // Half the width + 4px margin on both sides
let isMoving = false;
let autoSlideInterval;
let startX, endX;
let freezeTimeout;

let countdown = 4; // Start countdown from 4 seconds

// Add event listeners for arrow buttons to stop auto-slide
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Update Slider Width Based on Card Types
function updateSliderWidth() {
    const cards = document.querySelectorAll('.cardss, .emptyhalfcard');
    let totalWidth = 0;
    cards.forEach(card => {
        if (card.classList.contains('emptyhalfcard')) {
            totalWidth += halfCardWidth;
        } else {
            totalWidth += standardCardWidth;
        }
    });
    sliderWrapper.style.width = `${totalWidth}px`;
}

// Generalized Function to Move the Slider
function moveSlider(direction) {
    if (isMoving) return;
    isMoving = true;

    const maxVisibleCards = 3; // Show at most 3 cards at a time
    const totalCards = document.querySelectorAll('.cardss, .emptyhalfcard').length;
    const maxMoveLeft = -(totalCards - maxVisibleCards) * standardCardWidth;

    if (direction === 'right') {
        if (currentPosition > maxMoveLeft) {
            currentPosition -= standardCardWidth;
        } else {
            currentPosition = 0; // Bounce back to the start
        }
    } else if (direction === 'left') {
        if (currentPosition < 0) {
            currentPosition += standardCardWidth;
        } else {
            currentPosition = maxMoveLeft; // Bounce back to the end
        }
    }

    sliderWrapper.style.transform = `translateX(${currentPosition}px)`;

    setTimeout(() => {
        isMoving = false;
    }, 1000); // 1 second transition time
}

// Manual and Automatic Slider Controls
function moveRight() {
    moveSlider('right');
}

function moveLeft() {
    moveSlider('left');
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveRight();
    }, 4000); // Auto-slide interval set to 4 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval); // Stop the auto-slide
    clearTimeout(freezeTimeout); // Clear any existing timeout
    freezeTimeout = setTimeout(() => {
        startAutoSlide(); // Restart auto-slide after 6 seconds
    }, 6000); // 6 seconds freeze time
}

// Touch Events for Slider Navigation
sliderWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoSlide(); // Stop auto-slide on touch start
});

sliderWrapper.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        moveRight();
    } else if (endX - startX > 50) {
        moveLeft();
    }
});

// Arrow Button Click Events
leftButton.addEventListener('click', () => {
    moveLeft();
    stopAutoSlide(); // Stop auto-slide on arrow click
});

rightButton.addEventListener('click', () => {
    moveRight();
    stopAutoSlide(); // Stop auto-slide on arrow click
});

// Adjust Cards Based on Screen Width
function adjustCards() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1000) {
        // Remove cardssDEL cards
        document.querySelectorAll('.cardssDEL').forEach(card => card.remove());

        // Ensure emptyhalfcard is visible
        if (!document.querySelector('.emptyhalfcard')) {
            const emptyHalfCard = document.createElement('div');
            emptyHalfCard.className = 'cardss emptyhalfcard';
            sliderWrapper.insertBefore(emptyHalfCard, sliderWrapper.firstChild);
        }
    } else {
        // Reinsert cardssDEL if needed
        const existingCards = Array.from(sliderWrapper.children);
        if (!existingCards.some(card => card.classList.contains('cardssDEL'))) {
            const numEmptyCards = 2;
            const emptyCards = document.createDocumentFragment();
            for (let i = 0; i < numEmptyCards; i++) {
                const emptyCard = document.createElement('div');
                emptyCard.className = 'cardss cardssDEL';
                emptyCards.appendChild(emptyCard);
            }
            sliderWrapper.appendChild(emptyCards);
        }

        // Remove emptyhalfcard if screen is smaller
        document.querySelectorAll('.emptyhalfcard').forEach(card => card.remove());
    }

    updateSliderWidth();
}

// Initial Setup and Event Listeners for Slider
updateSliderWidth();
startAutoSlide();
adjustCards();

// Adjust cards on page load and window resize
window.addEventListener('resize', adjustCards);





document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});