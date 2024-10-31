document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const plainAlphabet = document.getElementById('plainAlphabet');
    const cipherAlphabet = document.getElementById('cipherAlphabet');
    const arrowRow = document.getElementById('arrowRow');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let isEncoding = true;

    // Initialize the alphabet display
    function initializeAlphabetDisplay() {
        // Clear existing content
        plainAlphabet.innerHTML = '';
        cipherAlphabet.innerHTML = '';
        arrowRow.innerHTML = '';

        // Add original alphabet cells
        for (let char of alphabet) {
            const cell = document.createElement('div');
            cell.className = 'alphabet-cell';
            cell.textContent = char;
            plainAlphabet.appendChild(cell);

            // Add arrow
            const arrowCell = document.createElement('div');
            arrowCell.className = 'arrow-cell';
            arrowCell.textContent = '↓';
            arrowRow.appendChild(arrowCell);

            // Add substitution alphabet cell (initially empty)
            const subCell = document.createElement('div');
            subCell.className = 'alphabet-cell';
            subCell.textContent = '';
            cipherAlphabet.appendChild(subCell);
        }
    }

    // Update the substitution display
    function updateSubstitutionDisplay(key) {
        const cipherCells = cipherAlphabet.getElementsByClassName('alphabet-cell');
        const arrows = arrowRow.getElementsByClassName('arrow-cell');
        
        for (let i = 0; i < alphabet.length; i++) {
            if (i < key.length) {
                cipherCells[i].textContent = key[i];
                arrows[i].textContent = isEncoding ? '↓' : '↑';
            } else {
                cipherCells[i].textContent = '';
                arrows[i].textContent = '';
            }
        }
    }

    function encode(text, key) {
        if (key.length !== 26) return text;
        
        const encodeMap = {};
        for (let i = 0; i < alphabet.length; i++) {
            encodeMap[alphabet[i]] = key[i];
        }
        
        return text.toUpperCase().split('').map(char => {
            return encodeMap[char] || char;
        }).join('');
    }

    function decode(text, key) {
        if (key.length !== 26) return text;
        
        const decodeMap = {};
        for (let i = 0; i < key.length; i++) {
            decodeMap[key[i]] = alphabet[i];
        }
        
        return text.toUpperCase().split('').map(char => {
            return decodeMap[char] || char;
        }).join('');
    }

    function processText() {
        const text = inputText.value.toUpperCase();
        const key = keyInput.value.toUpperCase();
        
        if (text && key.length === 26) {
            const result = isEncoding ? 
                encode(text, key) : 
                decode(text, key);
            outputText.value = result;
            updateSubstitutionDisplay(key);
        } else {
            outputText.value = '';
            updateSubstitutionDisplay('');
        }
    }

    // Event listeners
    inputText.addEventListener('input', processText);
    keyInput.addEventListener('input', () => {
        keyInput.value = keyInput.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        processText();
    });
    
    encodeTab.addEventListener('click', () => {
        isEncoding = true;
        encodeTab.classList.add('active');
        decodeTab.classList.remove('active');
        processText();
    });

    decodeTab.addEventListener('click', () => {
        isEncoding = false;
        decodeTab.classList.add('active');
        encodeTab.classList.remove('active');
        processText();
    });

    // Initialize the display
    initializeAlphabetDisplay();
});