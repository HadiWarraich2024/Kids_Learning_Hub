// Common data and functions for all learning pages
const learningData = {
    alphabet: {
        items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        phrases: [
            "A for Apple 🍎", "B for Ball 🏀", "C for Cat 🐱", "D for Dog 🐶", "E for Elephant 🐘",
            "F for Fish 🐟", "G for Goat 🐐", "H for Hat 🎩", "I for Ice cream 🍦", "J for Jug 🏺",
            "K for Kite 🪁", "L for Lion 🦁", "M for Mango 🥭", "N for Nest 🪺", "O for Orange 🍊",
            "P for Parrot 🦜", "Q for Queen 👸", "R for Rabbit 🐇", "S for Sun ☀️", "T for Tiger 🐅",
            "U for Umbrella ☂️", "V for Van 🚐", "W for Watch ⌚", "X for Xylophone 🎼", "Y for Yak 🦬", "Z for Zebra 🦓"
        ]
    },
    numbers: {
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
        phrases: [
            "One", "Two", "Three", "Four", "Five",
            "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
            "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
        ]
    },
    colors: {
        items: ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Black", "White"],
        phrases: [
            "Red like an apple 🍎", "Orange like an orange 🍊", "Yellow like the sun ☀️", 
            "Green like grass 🌱", "Blue like the sky 🌤️", "Purple like grapes 🍇", 
            "Pink like cotton candy 🍬", "Brown like chocolate 🍫", "Black like a bat 🦇", 
            "White like snow ⛄"
        ],
        colorCodes: ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#800080", "#FFC0CB", "#A52A2A", "#000000", "#FFFFFF"]
    },
    shapes: {
        items: ["Circle", "Square", "Triangle", "Rectangle", "Star", "Heart", "Diamond", "Oval", "Pentagon", "Hexagon"],
        phrases: [
            "Circle - Round like a ball ⚽", 
            "Square - Four equal sides 📦", 
            "Triangle - Three sides 🔺", 
            "Rectangle - Like a door 🚪", 
            "Star - Twinkle twinkle little star 🌟", 
            "Heart - Love is in the air ❤️", 
            "Diamond - Shiny like a gem 💎", 
            "Oval - Like an egg 🥚", 
            "Pentagon - Five sides ⬟", 
            "Hexagon - Six sides ⬡"
        ],
        shapeIcons: ["🔴", "🟥", "🔺", "🚪", "⭐", "❤️", "💎", "🥚", "⬟", "⬡"]
    },
    animals: {
        items: ["Dog", "Cat", "Elephant", "Lion", "Monkey", "Giraffe", "Penguin", "Dolphin", "Butterfly", "Frog"],
        phrases: [
            "Dog - Woof woof! 🐶", 
            "Cat - Meow! 🐱", 
            "Elephant - Big and gray 🐘", 
            "Lion - King of the jungle 🦁", 
            "Monkey - Loves bananas 🐒", 
            "Giraffe - Long neck 🦒", 
            "Penguin - Waddles on ice 🐧", 
            "Dolphin - Smart swimmer 🐬", 
            "Butterfly - Colorful wings 🦋", 
            "Frog - Jumps high 🐸"
        ],
        animalEmojis: ["🐶", "🐱", "🐘", "🦁", "🐒", "🦒", "🐧", "🐬", "🦋", "🐸"]
    }
};

let currentIndex = 0;
let isSpeaking = false;
let currentType = '';
let utterance = null;

function initPage(type) {
    currentType = type;
    const output = document.getElementById('output');
    const phrase = document.getElementById('phrase');
    
    if (!output || !phrase) {
        console.error("Required elements not found in the DOM");
        return;
    }
    
    output.textContent = '';
    phrase.textContent = '';
    output.innerHTML = '';
}

async function speakCurrent() {
    if (isSpeaking) return;
    
    const data = learningData[currentType];
    if (!data || currentIndex >= data.items.length) return;
    
    const item = data.items[currentIndex];
    const phrase = data.phrases[currentIndex];
    const output = document.getElementById('output');
    const phraseElement = document.getElementById('phrase');
    
    if (!output || !phraseElement) return;
    
    output.innerHTML = '';
    phraseElement.textContent = phrase;
    
    if (currentType === 'colors' && data.colorCodes) {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = data.colorCodes[currentIndex];
        output.appendChild(colorBox);
    } 
    else if (currentType === 'shapes' && data.shapeIcons) {
        const shapeDisplay = document.createElement('div');
        shapeDisplay.className = 'shape-display';
        shapeDisplay.textContent = data.shapeIcons[currentIndex];
        output.appendChild(shapeDisplay);
    } 
   else if (currentType === 'animals' && data.animalEmojis) {
    const animalDisplay = document.createElement('div');
    animalDisplay.className = 'animal-display';
    animalDisplay.textContent = data.animalEmojis[currentIndex];
    output.appendChild(animalDisplay);
}
    else {
        output.textContent = item;
    }
    
    try {
        const voices = await loadVoices();
        const englishVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
        
        utterance = new SpeechSynthesisUtterance(phrase.replace(/[^\w\s-]/gi, ''));
        utterance.voice = englishVoice;
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        
        isSpeaking = true;
        
        utterance.onend = utterance.onerror = () => {
            isSpeaking = false;
            currentIndex++;
            if (currentIndex < data.items.length) {
                setTimeout(speakCurrent, 1000);
            }
        };
        
        speechSynthesis.speak(utterance);
    } catch (error) {
        console.error("Speech synthesis error:", error);
        isSpeaking = false;
    }
}

function loadVoices() {
    return new Promise(resolve => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                resolve(window.speechSynthesis.getVoices());
            };
        }
    });
}

function startSpeaking() {
    currentIndex = 0;
    speechSynthesis.cancel();
    speakCurrent();
}

function pauseSpeaking() {
    speechSynthesis.pause();
}

function resumeSpeaking() {
    speechSynthesis.resume();
}

function stopSpeaking() {
    speechSynthesis.cancel();
    isSpeaking = false;
}

window.addEventListener('load', () => {
    loadVoices();
    const path = window.location.pathname;
    if (path.includes('alphabet')) initPage('alphabet');
    else if (path.includes('numbers')) initPage('numbers');
    else if (path.includes('colors')) initPage('colors');
    else if (path.includes('shapes')) initPage('shapes');
    else if (path.includes('animals')) initPage('animals');
});

// Make functions available globally
window.initPage = initPage;
window.startSpeaking = startSpeaking;
window.pauseSpeaking = pauseSpeaking;
window.resumeSpeaking = resumeSpeaking;
window.stopSpeaking = stopSpeaking;
