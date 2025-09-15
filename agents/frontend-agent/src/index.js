// // index.js
// const axios = require('axios');

// class SentinelWebAgent {
//     constructor(config) {
//         this.endpoint = config.endpoint; // ML model server endpoint
//         this.sessionId = this.generateSessionId();
        
//         this.keystrokes = [];
//         this.lastKeystrokeTime = null;
        
//         this.clicks = 0;
//         this.requestCount = 0;
        
//         this.startTime = Date.now();

//         this.inputField = config.inputField; // The input field to monitor
//         this.monitoringInterval = config.monitoringInterval || 2000; // how often to send data
        
//         this.init();
//     }

//     generateSessionId() {
//         return 'sess-' + Math.random().toString(36).substr(2, 9);
//     }

//     init() {
//         this.attachToInput();
//         this.attachToClickEvents();
//         this.startMonitoring();
//     }

//     // Real-time: Attach event listener for typing
//     attachToInput() {
//         this.inputField.addEventListener('keydown', (event) => {
//             this.keystrokes.push(event.key);
//             this.lastKeystrokeTime = Date.now();
//         });

//         // Also track requests (simulate with focus or blur for demo purposes)
//         this.inputField.addEventListener('focus', () => {
//             this.requestCount += 1;
//         });
//         this.inputField.addEventListener('blur', () => {
//             this.requestCount += 1;
//         });
//     }

//     // Real-time: Attach event listener for clicks anywhere on the page
//     attachToClickEvents() {
//         document.addEventListener('click', () => {
//             this.clicks += 1;
//         });
//     }

//     // Calculate entropy of keystrokes typed so far
//     calculateKeystrokeEntropy() {
//         if (this.keystrokes.length === 0) return 0;
//         const freq = {};
//         this.keystrokes.forEach(char => {
//             freq[char] = (freq[char] || 0) + 1;
//         });
//         const total = this.keystrokes.length;
//         let entropy = 0;
//         for (let char in freq) {
//             const p = freq[char] / total;
//             entropy -= p * Math.log2(p);
//         }
//         return parseFloat((entropy / 5).toFixed(4)); // normalize and round
//     }

//     getInputLength() {
//         return this.inputField.value.length;
//     }

//     getSuspiciousKeywordsCount() {
//         const suspiciousWords = ["<script>", "onerror", "alert", "SELECT", "DROP"];
//         let count = 0;
//         suspiciousWords.forEach(word => {
//             count += (this.inputField.value.match(new RegExp(word, "gi")) || []).length;
//         });
//         return count;
//     }

//     getTypingSpeed() {
//         if (!this.lastKeystrokeTime) return 0;
//         const currentTime = Date.now();
//         const speed = currentTime - this.lastKeystrokeTime;
//         return speed;
//     }

//     getClickFrequency() {
//         const elapsed = (Date.now() - this.startTime) / 1000;
//         return elapsed > 0 ? parseFloat((this.clicks / elapsed).toFixed(4)) : 0;
//     }

//     getRequestRate() {
//         const elapsed = (Date.now() - this.startTime) / 1000;
//         return elapsed > 0 ? parseFloat((this.requestCount / elapsed).toFixed(4)) : 0;
//     }

//     isCsrfTokenMissing() {
//     let missing = false;
//     // Check forms in the document
//     const forms = document.querySelectorAll('form');
//     forms.forEach(form => {
//         const tokenInput = form.querySelector('input[name="csrf_token"], input[name="csrf"]');
//         if (!tokenInput) {
//             missing = true;
//         }
//     });
//     return missing;
// }
// cd
//     collectData() {
//         return {
//             session_id: this.sessionId,
//             keystroke_entropy: this.calculateKeystrokeEntropy(),
//             input_length: this.getInputLength(),
//             suspicious_keywords_count: this.getSuspiciousKeywordsCount(),
//             typing_speed_ms: this.getTypingSpeed(),
//             click_frequency: this.getClickFrequency(),
//             request_rate: this.getRequestRate(),
//             csrf_token_missing: this.isCsrfTokenMissing(),
//             dom_script_injection: this.isDomScriptInjection(),
//             navigation_flow_anomaly: this.isNavigationFlowAnomaly()
//         };
//     }

//     async sendData(data) {
//         try {
//             const res = await axios.post(this.endpoint, data);
//             console.log("Data sent:", data);
//         } catch (error) {
//             console.error("Error sending data:", error.message);
//         }
//     }

//     startMonitoring() {
//         setInterval(() => {
//             const data = this.collectData();
//             this.sendData(data);
//         }, this.monitoringInterval);
//     }
// }

// module.exports = SentinelWebAgent;


// src/index.js

class SentinelWebAgent {
    constructor(config) {
        this.endpoint = config.endpoint || ''; // Not used for this test
        this.sessionId = this.generateSessionId();
        
        this.keystrokes = [];
        this.lastKeystrokeTime = null;
        
        this.clicks = 0;
        this.requestCount = 0;
        
        this.startTime = Date.now();

        this.inputField = config.inputField;
        this.monitoringInterval = config.monitoringInterval || 2000;
        
        this.init();
    }

    generateSessionId() {
        return 'sess-' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.attachToInput();
        this.attachToClickEvents();
        this.startMonitoring();
    }

    attachToInput() {
        this.inputField.addEventListener('keydown', (event) => {
            this.keystrokes.push(event.key);
            this.lastKeystrokeTime = Date.now();
        });

        this.inputField.addEventListener('focus', () => {
            this.requestCount += 1;
        });

        this.inputField.addEventListener('blur', () => {
            this.requestCount += 1;
        });
    }

    attachToClickEvents() {
        document.addEventListener('click', () => {
            this.clicks += 1;
        });
    }

    calculateKeystrokeEntropy() {
        if (this.keystrokes.length === 0) return 0;
        const freq = {};
        this.keystrokes.forEach(char => {
            freq[char] = (freq[char] || 0) + 1;
        });
        const total = this.keystrokes.length;
        let entropy = 0;
        for (let char in freq) {
            const p = freq[char] / total;
            entropy -= p * Math.log2(p);
        }
        return parseFloat((entropy / 5).toFixed(4));
    }

    getInputLength() {
        return this.inputField.value.length;
    }

    getSuspiciousKeywordsCount() {
        const suspiciousWords = ["<script>", "onerror", "alert", "SELECT", "DROP"];
        let count = 0;
        suspiciousWords.forEach(word => {
            count += (this.inputField.value.match(new RegExp(word, "gi")) || []).length;
        });
        return count;
    }

    getTypingSpeed() {
        if (!this.lastKeystrokeTime) return 0;
        const currentTime = Date.now();
        const speed = currentTime - this.lastKeystrokeTime;
        return speed;
    }

    getClickFrequency() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed > 0 ? parseFloat((this.clicks / elapsed).toFixed(4)) : 0;
    }

    getRequestRate() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed > 0 ? parseFloat((this.requestCount / elapsed).toFixed(4)) : 0;
    }

    // isCsrfTokenMissing() {
    //     let missing = false;
    //     const forms = document.querySelectorAll('form');
    //     forms.forEach(form => {
    //         const tokenInput = form.querySelector('input[name="csrf_token"], input[name="csrf"]');
    //         if (!tokenInput) {
    //             missing = true;
    //         }
    //     });
    //     return missing;
    // }
    isCsrfTokenMissing() {
    let missing = false;
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Look for hidden input fields named csrf_token or csrf
        const tokenInput = form.querySelector('input[type="hidden"][name="csrf_token"], input[type="hidden"][name="csrf"]');
        if (!tokenInput) {
            missing = true;
        }
    });
    return missing;
}

    isDomScriptInjection() {
        let suspicious = false;
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src === '' && script.innerHTML.includes('alert')) {
                suspicious = true;
            }
        });
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            for (let attr of el.attributes) {
                if (attr.name.startsWith('on') && attr.value.includes('alert')) {
                    suspicious = true;
                }
            }
        });
        return suspicious;
    }

    isNavigationFlowAnomaly() {
    let anomaly = false;
    const navHistory = JSON.parse(localStorage.getItem('navHistory') || '[]');
    const lastUnload = JSON.parse(localStorage.getItem('lastUnload') || 'null');
    const currentUrl = window.location.pathname;

    // Check navigation history
    if (navHistory.length > 0) {
        const lastVisit = navHistory[navHistory.length - 1];
        if (lastVisit.url === currentUrl && (Date.now() - lastVisit.timestamp < 3000)) {
            anomaly = true;
        }
    }

    // Check if page was reloaded recently
    if (lastUnload && lastUnload.url === currentUrl && (Date.now() - lastUnload.timestamp < 3000)) {
        anomaly = true;
    }

    // Save the current visit to nav history
    navHistory.push({ url: currentUrl, timestamp: Date.now() });
    if (navHistory.length > 10) navHistory.shift(); // keep last 10 visits
    localStorage.setItem('navHistory', JSON.stringify(navHistory));

    return anomaly;
}


    collectData() {
        return {
            session_id: this.sessionId,
            keystroke_entropy: this.calculateKeystrokeEntropy(),
            input_length: this.getInputLength(),
            suspicious_keywords_count: this.getSuspiciousKeywordsCount(),
            typing_speed_ms: this.getTypingSpeed(),
            click_frequency: this.getClickFrequency(),
            request_rate: this.getRequestRate(),
            csrf_token_missing: this.isCsrfTokenMissing(),
            dom_script_injection: this.isDomScriptInjection(),
            navigation_flow_anomaly: this.isNavigationFlowAnomaly()
        };
    }

    sendData(data) {
        console.log("Collected data:", data);
    }

    startMonitoring() {
        setInterval(() => {
            const data = this.collectData();
            this.sendData(data);
        }, this.monitoringInterval);
    }
}

// Use ES module export syntax
export default SentinelWebAgent;
