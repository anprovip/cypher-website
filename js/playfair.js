class PlayfairCipher {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.key = document.getElementById('key');
        this.encodeTab = document.getElementById('encodeTab');
        this.decodeTab = document.getElementById('decodeTab');
        this.matrixGrid = document.getElementById('matrixGrid');
        this.isDecryptMode = false;
        this.matrix = [];
        this.initializeEventListeners();
        this.initializeMatrix();
    }

    initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            this.input.addEventListener(event, () => this.process());
            this.key.addEventListener(event, () => {
                this.initializeMatrix();
                this.process();
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

    generatePlayfairMatrix(key) {
        const matrix = Array(5).fill().map(() => Array(5).fill(''));
        const used = new Map();
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I/J combined
        
        let index = 0;
        
        // First, fill with key
        const processedKey = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        for (const char of processedKey) {
            if (!used.has(char)) {
                matrix[Math.floor(index / 5)][index % 5] = char;
                used.set(char, true);
                index++;
            }
        }
        
        // Then fill remaining with alphabet
        for (const char of alphabet) {
            if (!used.has(char)) {
                matrix[Math.floor(index / 5)][index % 5] = char;
                used.set(char, true);
                index++;
            }
        }
        
        return matrix;
    }

    findPosition(char, matrix) {
        char = char === 'J' ? 'I' : char;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (matrix[row][col] === char) {
                    return [row, col];
                }
            }
        }
        return [-1, -1];
    }

    preparePairs(text) {
        // Convert text to uppercase and replace J with I
        text = text.toUpperCase().replace(/J/g, 'I');
        
        // Remove non-alphabetic characters
        text = text.replace(/[^A-Z]/g, '');
        
        // Insert X between repeated letters and create pairs
        const pairs = [];
        let i = 0;
        
        while (i < text.length) {
            let pair = text[i];
            
            if (i + 1 >= text.length) {
                // If last character, add X
                pairs.push([pair, 'X']);
                break;
            }
            
            if (text[i] === text[i + 1]) {
                // If repeated letter, insert X
                pairs.push([pair, 'X']);
                i++;
            } else {
                // Normal pair
                pairs.push([pair, text[i + 1]]);
                i += 2;
            }
        }
        
        return pairs;
    }

    playfairEncrypt(text) {
        const pairs = this.preparePairs(text);
        let result = '';
        
        for (const [first, second] of pairs) {
            const [row1, col1] = this.findPosition(first, this.matrix);
            const [row2, col2] = this.findPosition(second, this.matrix);
            
            if (row1 === row2) {
                // Same row: move right
                result += this.matrix[row1][(col1 + 1) % 5];
                result += this.matrix[row2][(col2 + 1) % 5];
            }
            else if (col1 === col2) {
                // Same column: move down
                result += this.matrix[(row1 + 1) % 5][col1];
                result += this.matrix[(row2 + 1) % 5][col2];
            }
            else {
                // Rectangle: swap columns
                result += this.matrix[row1][col2];
                result += this.matrix[row2][col1];
            }
        }
        
        return result;
    }

    playfairDecrypt(text) {
        // Ensure text length is even
        if (text.length % 2 !== 0) {
            text += 'X';
        }

        const pairs = [];
        for (let i = 0; i < text.length; i += 2) {
            pairs.push([text[i], text[i + 1]]);
        }

        let result = '';
        
        for (const [first, second] of pairs) {
            const [row1, col1] = this.findPosition(first, this.matrix);
            const [row2, col2] = this.findPosition(second, this.matrix);
            
            if (row1 === row2) {
                // Same row: move left
                result += this.matrix[row1][(col1 + 4) % 5];
                result += this.matrix[row2][(col2 + 4) % 5];
            }
            else if (col1 === col2) {
                // Same column: move up
                result += this.matrix[(row1 + 4) % 5][col1];
                result += this.matrix[(row2 + 4) % 5][col2];
            }
            else {
                // Rectangle: swap columns
                result += this.matrix[row1][col2];
                result += this.matrix[row2][col1];
            }
        }
        
        return result;
    }

    updateMatrixDisplay() {
        this.matrixGrid.innerHTML = '';
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = this.matrix[row][col];
                this.matrixGrid.appendChild(cell);
            }
        }
    }

    initializeMatrix() {
        this.matrix = this.generatePlayfairMatrix(this.key.value);
        this.updateMatrixDisplay();
    }

    formatText(text) {
        // Store original format
        const format = text.split('').map(char => ({
            char,
            isUpper: char === char.toUpperCase(),
            isLetter: /[A-Za-z]/.test(char)
        }));
        
        // Return only letters in uppercase for processing
        return {
            processText: text.replace(/[^A-Za-z]/g, '').toUpperCase(),
            format
        };
    }

    restoreFormat(processed, format) {
        let result = '';
        let processedIndex = 0;
        
        for (const charInfo of format) {
            if (charInfo.isLetter) {
                let char = processed[processedIndex++];
                result += charInfo.isUpper ? char : char.toLowerCase();
            } else {
                result += charInfo.char;
            }
        }
        
        return result;
    }

    process() {
        const text = this.input.value;
        if (!text) {
            this.output.value = '';
            return;
        }

        const { processText, format } = this.formatText(text);
        
        const processed = this.isDecryptMode ? 
            this.playfairDecrypt(processText) : 
            this.playfairEncrypt(processText);
            
        const result = this.restoreFormat(processed, format);
        this.output.value = result;
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PlayfairCipher();
});