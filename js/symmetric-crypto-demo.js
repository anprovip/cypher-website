function generateKey(user) {
    const key = CryptoJS.lib.WordArray.random(32).toString();
    document.getElementById(user + 'Key').value = key;
}

function sendKey() {
    const key = document.getElementById('aliceKey').value;
    document.getElementById('bobKey').value = key;
}

function encrypt() {
    const key = document.getElementById('aliceKey').value;
    const plaintext = document.getElementById('alicePlaintext').value;
    
    if (!key || !plaintext) {
        alert('Please enter both key and message');
        return;
    }

    const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
    document.getElementById('aliceCiphertext').value = encrypted;
}

function decrypt() {
    const key = document.getElementById('bobKey').value;
    const ciphertext = document.getElementById('bobCiphertext').value;
    
    try {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
        document.getElementById('bobPlaintext').value = decrypted;
    } catch (e) {
        alert('Decryption failed. Please check the key.');
        document.getElementById('bobPlaintext').value = '';
    }
}

function sendCiphertext() {
    const ciphertext = document.getElementById('aliceCiphertext').value;
    document.getElementById('bobCiphertext').value = ciphertext;
    document.getElementById('eveCiphertext').value = ciphertext;
}

function eveDecrypt() {
    const key = document.getElementById('eveKey').value;
    const ciphertext = document.getElementById('eveCiphertext').value;
    
    try {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
            document.getElementById('evePlaintext').value = decrypted;
        } else {
            throw new Error('Decryption failed');
        }
    } catch (e) {
        document.getElementById('evePlaintext').value = '[Decryption failed - Invalid key]';
    }
}

// Initialize with demo values
document.getElementById('alicePlaintext').value = "This is a secret message";
generateKey('alice');
encrypt();
sendKey();
sendCiphertext();
decrypt();