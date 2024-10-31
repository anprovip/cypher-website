class CaesarCipher {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.shift = document.getElementById('shift');
        this.encodeTab = document.getElementById('encodeTab');
        this.decodeTab = document.getElementById('decodeTab');
        this.isDecryptMode = false;
        this.initializeEventListeners();
        this.updateAlphabetDisplay(parseInt(this.shift.value) || 3);
    }

    initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            this.input.addEventListener(event, () => this.process());

            this.shift.addEventListener(event, () => {
                this.process();
                this.updateAlphabetDisplay(parseInt(this.shift.value) || 3);
            });
        });

        this.encodeTab.addEventListener('click', () => {
            this.isDecryptMode = false;
            this.encodeTab.classList.add('active');
            this.decodeTab.classList.remove('active');
            this.process();
        });

        this.decodeTab.addEventListener('click', () => {
            this.isDecryptMode = true;
            this.decodeTab.classList.add('active');
            this.encodeTab.classList.remove('active');
            this.process();
        });
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


    updateAlphabetDisplay(shift) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);
        
        const cells = document.querySelectorAll('.shifted-row td');
        for (let i = 0; i < shiftedAlphabet.length; i++) {
            cells[i].textContent = shiftedAlphabet[i];
        }
    }

    process() {
        const result = this.caesar(
            this.input.value,
            parseInt(this.shift.value) || 3,
            this.isDecryptMode
        );
        if (result) this.output.value = result;
    }
}
// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CaesarCipher();

});