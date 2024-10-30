class CaesarCipher {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.shift = document.getElementById('shift');
        this.modeToggle = document.getElementById('modeToggle');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            this.input.addEventListener(event, () => this.process());
            this.shift.addEventListener(event, () => this.process());
        });
        this.modeToggle.addEventListener('change', () => this.process());
    }

    validateInput() {
        const shiftValue = parseInt(this.shift.value);
        if (isNaN(shiftValue) || shiftValue < 1 || shiftValue > 25) {
            this.output.value = 'Shift value must be between 1 and 25';
            return false;
        }
        return true;
    }

    caesar(text, shift, decrypt = false) {
        if (!text) return '';
        if (!this.validateInput()) return;
        
        shift = ((shift % 26) + 26) % 26;
        return text
            .split('')
            .map(char => {
                if (char.match(/[a-z]/i)) {
                    const code = char.charCodeAt(0);
                    const isUpperCase = code >= 65 && code <= 90;
                    const base = isUpperCase ? 65 : 97;
                    const shiftAmount = decrypt ? (26 - shift) : shift;
                    return String.fromCharCode(((code - base + shiftAmount) % 26) + base);
                }
                return char;
            })
            .join('');
    }

    process() {
        const isDecryptMode = this.modeToggle.checked;
        const result = this.caesar(
            this.input.value,
            parseInt(this.shift.value) || 3,
            isDecryptMode
        );
        if (result) this.output.value = result;
    }
}

new CaesarCipher();

// Add this to caesar.js
function updateAlphabetDisplay(shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);
    
    // Update shifted alphabet cells
    const cells = document.querySelectorAll('tr:nth-child(2) td');
    for (let i = 0; i < shiftedAlphabet.length; i++) {
        cells[i].textContent = shiftedAlphabet[i];
    }
}

// Add event listener when document loads
function updateAlphabetDisplay(shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);
    
    // Update shifted alphabet cells
    const cells = document.querySelectorAll('tbody tr td');
    for (let i = 0; i < shiftedAlphabet.length; i++) {
        cells[i].textContent = shiftedAlphabet[i];
    }
}

// Add event listener when document loads
document.addEventListener('DOMContentLoaded', () => {
    const shiftInput = document.getElementById('shift');
    
    // Initial display
    updateAlphabetDisplay(parseInt(shiftInput.value) || 3);
    
    // Update when shift changes
    shiftInput.addEventListener('input', (e) => {
        let shift = parseInt(e.target.value);
        if (shift >= 1 && shift <= 25) {
            updateAlphabetDisplay(shift);
        }
    });
});