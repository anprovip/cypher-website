document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const demoText = document.getElementById('demoText');
    const demoInitialKey = document.getElementById('demoInitialKey');
    const demoGeneratedKey = document.getElementById('demoGeneratedKey');

    let isEncoding = true;

    function generateRepeatKey(text, key) {
        if (key.length === 0) return '';
        let generatedKey = '';
        for (let i = 0; i < text.length; i++) {
            generatedKey += key[i % key.length];
        }
        return generatedKey;
    }

    function generateAutoKey(text, key) {
        if (key.length === 0) return '';
        let generatedKey = key;
        for (let i = 0; i < text.length - key.length; i++) {
            generatedKey += text[i];
        }
        return generatedKey;
    }

    function vigenereEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            let charCode = ((text.charCodeAt(i) - 65 + (key.charCodeAt(i) - 65)) % 26) + 65;
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function vigenereDecrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            let charCode = ((text.charCodeAt(i) - key.charCodeAt(i) + 26) % 26) + 65;
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function updateDemo(text, key, generatedKey) {
        demoText.textContent = text || '[Enter text]';
        demoInitialKey.textContent = key || '[Enter key]';
        demoGeneratedKey.textContent = generatedKey || '[Generated key will appear here]';
    }

    function processText() {
        const text = inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = keyInput.value.toUpperCase().replace(/[^A-Z]/g, '');
        const keyType = document.querySelector('input[name="keyType"]:checked').value;

        if (text && key) {
            const generatedKey = keyType === 'auto' ? 
                generateAutoKey(text, key) : 
                generateRepeatKey(text, key);

            if (isEncoding) {
                outputText.value = vigenereEncrypt(text, generatedKey);
            } else {
                const initialKey = keyType === 'auto' ? key : generatedKey;
                outputText.value = keyType === 'auto' ? 
                    vigenereAutoKeyDecrypt(text, initialKey) : 
                    vigenereDecrypt(text, initialKey);
            }

            updateDemo(text, key, generatedKey);
        } else {
            outputText.value = '';
            updateDemo('', '', '');
        }
    }

    function vigenereAutoKeyDecrypt(text, key) {
        let result = '';
        let fullKey = key;
        
        for (let i = 0; i < text.length; i++) {
            let charCode = ((text.charCodeAt(i) - fullKey.charCodeAt(i) + 26) % 26) + 65;
            let decryptedChar = String.fromCharCode(charCode);
            result += decryptedChar;
            fullKey += decryptedChar;
        }
        
        return result;
    }

    // Event listeners
    inputText.addEventListener('input', () => {
        inputText.value = inputText.value.toUpperCase();
        processText();
    });

    keyInput.addEventListener('input', () => {
        keyInput.value = keyInput.value.toUpperCase();
        processText();
    });

    document.querySelectorAll('input[name="keyType"]').forEach(radio => {
        radio.addEventListener('change', processText);
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
});