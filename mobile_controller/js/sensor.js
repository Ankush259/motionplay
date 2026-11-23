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

    window.addEventListener('deviceorientation', (event) => {
        // event.beta: front-to-back tilt in degrees [-180, 180]
        // event.gamma: left-to-right tilt in degrees [-90, 90]
        // event.alpha: rotation around the z-axis (compass) [0, 360]
        
        // We round the numbers so they are readable, otherwise they fluctuate by decimals constantly
        const beta = Math.round(event.beta || 0);
        const gamma = Math.round(event.gamma || 0);
        const alpha = Math.round(event.alpha || 0);

        valBeta.textContent = `${beta}°`;
        valGamma.textContent = `${gamma}°`;
        valAlpha.textContent = `${alpha}°`;
    });
}