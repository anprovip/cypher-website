
let crypt = new JSEncrypt({default_key_size: 1024});

function generateKeys(user) {
    let keygen = new JSEncrypt({default_key_size: 1024});
    keygen.getKey();
    
    document.getElementById(user + 'Private').value = keygen.getPrivateKey();
    document.getElementById(user + 'Public').value = keygen.getPublicKey();
}

function sendPublicKey(from) {
    const publicKey = document.getElementById(from + 'Public').value;
    if (from === 'alice') {
        document.getElementById('bobAlicePublic').value = publicKey;
        document.getElementById('eveAlicePublic').value = publicKey;
    } else {
        document.getElementById('aliceBobPublic').value = publicKey;
        document.getElementById('eveBobPublic').value = publicKey;
    }
}

function encrypt() {
    const bobPublicKey = document.getElementById('aliceBobPublic').value;
    const plaintext = document.getElementById('alicePlaintext').value;
    
    if (!bobPublicKey || !plaintext) {
        alert('Please ensure Bob\'s public key is received and enter a message');
        return;
    }

    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(bobPublicKey);
    const encrypted = encrypt.encrypt(plaintext);
    
    document.getElementById('aliceCiphertext').value = encrypted;
}

function decrypt() {
    const privateKey = document.getElementById('bobPrivate').value;
    const ciphertext = document.getElementById('bobCiphertext').value;
    
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    
    try {
        const decrypted = decrypt.decrypt(ciphertext);
        if (decrypted) {
            document.getElementById('bobPlaintext').value = decrypted;
        } else {
            throw new Error('Decryption failed');
        }
    } catch (e) {
        alert('Decryption failed. Required private key.');
        document.getElementById('bobPlaintext').value = '';
    }
}

function sendCiphertext() {
    const ciphertext = document.getElementById('aliceCiphertext').value;
    document.getElementById('bobCiphertext').value = ciphertext;
    document.getElementById('eveCiphertext').value = ciphertext;
}

function eveDecrypt() {
    document.getElementById('evePlaintext').value = '[Decryption failed - Private key required]';
}

// Initialize
generateKeys('alice');
generateKeys('bob');
sendPublicKey('alice');
sendPublicKey('bob');
document.getElementById('alicePlaintext').value = "This is a secret message";
encrypt();
sendCiphertext();
decrypt();