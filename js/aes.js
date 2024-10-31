// S-box lookup table
const Sbox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const Rcon = [
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a,
    0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39
];

function rotWord(w) {
    const byte1 = (w >> 24) & 0xFF;
    const byte234 = w & 0xFFFFFF;
    return ((byte234 << 8) | byte1) >>> 0;
}

function subWord(w) {
    let result = 0;
    for (let i = 0; i < 4; i++) {
        const byte = (w >> (24 - i * 8)) & 0xFF;
        result = (result << 8) | Sbox[byte];
    }
    return result >>> 0;
}

function xorRcon(w, j) {
    const byte1 = (w >> 24) & 0xFF;
    const xorResult = (byte1 ^ Rcon[j]) & 0xFF;
    const byte234 = w & 0xFFFFFF;
    return ((xorResult << 24) | byte234) >>> 0;
}

function g(w, j) {
    const rotW = rotWord(w);
    const subW = subWord(rotW);
    return xorRcon(subW, j);
}

function keyExpansion(key) {
    const w = new Array(44);
    for (let i = 0; i < 4; i++) {
        w[i] = key[i];
    }
    
    for (let i = 4; i < 44; i++) {
        if (i % 4 === 0) {
            w[i] = g(w[i - 1], Math.floor(i/4)) ^ w[i - 4];
        } else {
            w[i] = w[i - 1] ^ w[i - 4];
        }
    }
    return w;
}

function addRoundKey(state, key) {
    return state.map((s, i) => s ^ key[i]);
}

function subBytes(state) {
    return state.map(word => subWord(word));
}

function shiftRows(state) {
    const result = new Array(4);
    for (let i = 0; i < 4; i++) {
        const byte1 = (state[i] >> 24) & 0xFF;
        const byte2 = (state[(i + 1) % 4] >> 16) & 0xFF;
        const byte3 = (state[(i + 2) % 4] >> 8) & 0xFF;
        const byte4 = state[(i + 3) % 4] & 0xFF;
        result[i] = ((byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4) >>> 0;
    }
    return result;
}

function mul2(x) {
    let result = x << 1;
    if (result >= 0x100) {
        result ^= 0x11B;
    }
    return result & 0xFF;
}

function mul3(x) {
    return mul2(x) ^ x;
}

function mixColumn(word) {
    const b = new Array(4);
    for (let i = 0; i < 4; i++) {
        b[i] = (word >> (24 - i * 8)) & 0xFF;
    }
    
    const result = [
        mul2(b[0]) ^ mul3(b[1]) ^ b[2] ^ b[3],
        b[0] ^ mul2(b[1]) ^ mul3(b[2]) ^ b[3],
        b[0] ^ b[1] ^ mul2(b[2]) ^ mul3(b[3]),
        mul3(b[0]) ^ b[1] ^ b[2] ^ mul2(b[3])
    ];
    
    return ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>> 0;
}

function mixColumns(state) {
    return state.map(word => mixColumn(word));
}

function showState(state, title) {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
        <h3>${title}</h3>
        <div class="matrix">
            ${state.map(word => `<div class="matrix-cell">${word.toString(16).padStart(8, '0').toUpperCase()}</div>`).join('')}
        </div>
    `;
    document.getElementById('steps').appendChild(div);
}

function parseHexString(hexStr) {
    // Remove any spaces from the hex string
    hexStr = hexStr.replace(/\s/g, '');
    
    // Parse into array of 4 32-bit words
    const words = new Array(4);
    for (let i = 0; i < 4; i++) {
        const start = i * 8;
        words[i] = parseInt(hexStr.slice(start, start + 8), 16) >>> 0;
    }
    return words;
}

function encrypt() {
    document.getElementById('steps').innerHTML = '';
    
    // Parse input
    const keyInput = document.getElementById('key').value.split(' ').map(x => parseInt(x, 16));
    const stateInput = document.getElementById('state').value.split(' ').map(x => parseInt(x, 16));
    
    let state = [...stateInput];
    const expandedKey = keyExpansion(keyInput);
    
    showState(state, 'Initial State');
    showState(keyInput, 'Initial Key');
    
    // Initial round
    state = addRoundKey(state, expandedKey.slice(0, 4));
    showState(state, 'After Initial AddRoundKey');
    
    // Main rounds
    for (let round = 1; round <= 9; round++) {
        state = subBytes(state);
        showState(state, `Round ${round} - After SubBytes`);
        
        state = shiftRows(state);
        showState(state, `Round ${round} - After ShiftRows`);
        
        state = mixColumns(state);
        showState(state, `Round ${round} - After MixColumns`);
        
        state = addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
        showState(state, `Round ${round} - After AddRoundKey`);
    }
    
    // Final round
    state = subBytes(state);
    showState(state, 'Final Round - After SubBytes');
    
    state = shiftRows(state);
    showState(state, 'Final Round - After ShiftRows');
    
    state = addRoundKey(state, expandedKey.slice(40, 44));
    showState(state, 'Final Ciphertext');
    
    // Add key expansion details
    const keyExpansionDiv = document.createElement('div');
    keyExpansionDiv.className = 'step';
    keyExpansionDiv.innerHTML = '<h3>Key Expansion Details</h3>';
    
    for (let i = 0; i < expandedKey.length; i++) {
        const word = expandedKey[i];
        const wordDiv = document.createElement('div');
        wordDiv.innerHTML = `w[${i}] = ${word.toString(16).padStart(8, '0').toUpperCase()}`;
        keyExpansionDiv.appendChild(wordDiv);
    }
    
    document.getElementById('steps').appendChild(keyExpansionDiv);
}

// Helper function to format state matrix display
function formatStateMatrix(state) {
    let html = '<div class="state-matrix">';
    for (let row = 0; row < 4; row++) {
        html += '<div class="matrix-row">';
        for (let col = 0; col < 4; col++) {
            const byteVal = (state[col] >> (24 - row * 8)) & 0xFF;
            html += `<span class="matrix-cell">${byteVal.toString(16).padStart(2, '0').toUpperCase()}</span>`;
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
}

// Input validation
function validateHexInput(input) {
    const hexPattern = /^([0-9A-Fa-f]{2}\s*){4}$/;
    return hexPattern.test(input);
}

// Add input event listeners
document.getElementById('key').addEventListener('input', function(e) {
    if (!validateHexInput(e.target.value)) {
        e.target.style.borderColor = 'red';
    } else {
        e.target.style.borderColor = '';
    }
});

document.getElementById('state').addEventListener('input', function(e) {
    if (!validateHexInput(e.target.value)) {
        e.target.style.borderColor = 'red';
    } else {
        e.target.style.borderColor = '';
    }
});

// Add some helpful error handling
function handleEncryption() {
    try {
        const keyInput = document.getElementById('key').value;
        const stateInput = document.getElementById('state').value;

        if (!validateHexInput(keyInput) || !validateHexInput(stateInput)) {
            throw new Error('Invalid input format. Please enter 4 hex values separated by spaces.');
        }

        encrypt();
    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '10px';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.backgroundColor = '#ffe6e6';
        errorDiv.style.borderRadius = '4px';
        errorDiv.textContent = `Error: ${error.message}`;
        
        const stepsDiv = document.getElementById('steps');
        stepsDiv.innerHTML = '';
        stepsDiv.appendChild(errorDiv);
    }
}

// Add this to the encryption button
document.querySelector('button').onclick = handleEncryption;

// Add some keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        handleEncryption();
    }
});

// Initialize with sample values
window.onload = function() {
    // Show initial state matrix
    const initialState = document.getElementById('state').value.split(' ').map(x => parseInt(x, 16));
    showState(initialState, 'Initial State Matrix');
}
