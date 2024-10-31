
        // Utility functions
        function gcd(a, b) {
            if (b === 0) return a;
            return gcd(b, a % b);
        }

        function modInverse(e, phi) {
            let m0 = phi;
            let y = 0;
            let x = 1;

            if (phi === 1) return 0;

            while (e > 1) {
                let q = Math.floor(e / phi);
                let t = phi;
                phi = e % phi;
                e = t;
                t = y;
                y = x - q * y;
                x = t;
            }

            if (x < 0) x += m0;
            return x;
        }

        function power(base, exp, mod) {
            let result = 1n;
            base = BigInt(base);
            exp = BigInt(exp);
            mod = BigInt(mod);
            base = base % mod;

            while (exp > 0n) {
                if (exp & 1n) {
                    result = (result * base) % mod;
                }
                base = (base * base) % mod;
                exp >>= 1n;
            }
            return Number(result);
        }

        let globalN = 0;
        let globalE = 0;
        let globalD = 0;

        function addStep(title, content) {
            const stepsContainer = document.getElementById('steps');
            const step = document.createElement('div');
            step.className = 'step';
            step.innerHTML = `
                <h3>${title}</h3>
                <pre>${content}</pre>
            `;
            stepsContainer.appendChild(step);
        }

        function generateKeys() {
            // Clear previous steps
            document.getElementById('steps').innerHTML = '';
            
            // Get input values
            const p = parseInt(document.getElementById('p').value);
            const q = parseInt(document.getElementById('q').value);
            const e = parseInt(document.getElementById('e').value);

            // Calculate n and phi
            const n = p * q;
            const phi = (p - 1) * (q - 1);
            
            // Calculate private key d
            const d = modInverse(e, phi);

            // Store globally
            globalN = n;
            globalE = e;
            globalD = d;

            // Display keys
            document.getElementById('public-key').innerHTML = `
                e = ${e}<br>
                n = ${n}
            `;
            document.getElementById('private-key').innerHTML = `
                d = ${d}<br>
                n = ${n}
            `;

            addStep('Key Generation', 
                `Prime numbers selected:
p = ${p}
q = ${q}

Calculating n = p * q:
n = ${p} * ${q} = ${n}

Calculating φ(n) = (p-1) * (q-1):
φ(n) = ${p-1} * ${q-1} = ${phi}

Public exponent e = ${e}
Private exponent d = ${d}`
            );
        }

        function encryptMessage() {
            const message = parseInt(document.getElementById('message').value);
            
            if (!globalN || !globalE) {
                alert('Please generate keys first!');
                return;
            }

            const ciphertext = power(message, globalE, globalN);

            addStep('Encryption',
                `Message (M) = ${message}

Encrypting using public key:
C = M^e mod n
C = ${message}^${globalE} mod ${globalN}
C = ${ciphertext}`
            );

            return ciphertext;
        }

        function decryptMessage() {
            const ciphertext = encryptMessage();
            
            if (!globalN || !globalD) {
                alert('Please generate keys first!');
                return;
            }

            const decrypted = power(ciphertext, globalD, globalN);

            addStep('Decryption',
                `Ciphertext (C) = ${ciphertext}

Decrypting using private key:
M = C^d mod n
M = ${ciphertext}^${globalD} mod ${globalN}
M = ${decrypted}`
            );
        }