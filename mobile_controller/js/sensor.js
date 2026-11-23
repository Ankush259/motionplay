const connectBtn = document.getElementById('connect-btn');
const statusPanel = document.getElementById('status-panel');
const valBeta = document.getElementById('val-beta');
const valGamma = document.getElementById('val-gamma');
const valAlpha = document.getElementById('val-alpha');

connectBtn.addEventListener('click', async () => {
    // Some browsers require explicit permission requests
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === 'granted') {
                startSensors();
            } else {
                alert("Permission to access sensors was denied.");
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
        }
    } else {
        // Non-iOS or older browsers that don't need explicit request
        startSensors();
    }
});

function startSensors() {
    connectBtn.style.display = 'none'; // Hide button once connected
    statusPanel.textContent = "Status: Sensors Active";
    statusPanel.classList.replace('disconnected', 'connected');

    // Create a single function to handle the math
    function handleOrientation(event) {
        const beta = Math.round(event.beta || 0);
        const gamma = Math.round(event.gamma || 0);
        const alpha = Math.round(event.alpha || 0);

        valBeta.textContent = `${beta}°`;
        valGamma.textContent = `${gamma}°`;
        valAlpha.textContent = `${alpha}°`;

        // Send data to the Mac via WebSocket
        if (window.sendSensorData) {
            window.sendSensorData(beta, gamma, alpha);
        }
    }

    // Android sometimes requires 'absolute', while iOS uses standard. 
    // We will listen to whichever one the phone supports.
    if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation);
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
    }
}