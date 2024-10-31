document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const matrixGrid = document.getElementById('matrixGrid');

    let isEncoding = true;

    // Event listeners
    inputText.addEventListener('input', processText);
    keyInput.addEventListener('input', processText);
    
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

    function createGrid(text, key) {
        const numRows = Math.ceil(text.length / key);
        matrixGrid.style.gridTemplateColumns = `repeat(${key}, 1fr)`;
        matrixGrid.innerHTML = '';

        // Create and fill the grid
        const grid = [];
        let index = 0;
        
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < key; j++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                
                if (index < text.length) {
                    cell.textContent = text[index];
                    row.push(text[index]);
                } else {
                    cell.textContent = 'X';
                    row.push('X');
                }
                
                matrixGrid.appendChild(cell);
                index++;
            }
            grid.push(row);
        }

        return grid;
    }

    function permutationEncrypt(text, key) {
        const grid = createGrid(text, key);
        let result = '';
        
        // Read columns
        for (let col = 0; col < key; col++) {
            for (let row = 0; row < grid.length; row++) {
                result += grid[row][col];
            }
        }
        
        return result;
    }

    function permutationDecrypt(text, key) {
        const numRows = Math.ceil(text.length / key);
        const grid = [];
        
        // Initialize grid
        for (let i = 0; i < numRows; i++) {
            grid.push(new Array(key).fill('X'));
        }
        
        // Fill grid by columns (how the text was encrypted)
        let index = 0;
        for (let col = 0; col < key; col++) {
            for (let row = 0; row < numRows; row++) {
                if (index < text.length) {
                    grid[row][col] = text[index++];
                }
            }
        }
        
        // Display the grid
        matrixGrid.style.gridTemplateColumns = `repeat(${key}, 1fr)`;
        matrixGrid.innerHTML = '';
        
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < key; j++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = grid[i][j];
                matrixGrid.appendChild(cell);
            }
        }
        
        // Read rows to get original text
        let result = '';
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < key; col++) {
                result += grid[row][col];
            }
        }
        
        return result;
    }

    function processText() {
        const text = inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = parseInt(keyInput.value) || 2;
        
        if (text && key > 1 && key <= text.length) {
            const result = isEncoding ? 
                permutationEncrypt(text, key) : 
                permutationDecrypt(text, key);
            outputText.value = result;
        } else {
            outputText.value = '';
            matrixGrid.innerHTML = '';
        }
    }

    // Initial processing
    processText();
});