// Connect to the WebSocket on the same IP that served the page
const wsUrl = `ws://${window.location.host}/ws`;
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
    console.log("WebSocket Tunnel Opened to Mac!");
};

socket.onclose = () => {
    console.log("WebSocket Tunnel Closed.");
};

// This function will be called by sensor.js every time the phone moves
window.sendSensorData = function(beta, gamma, alpha) {
    if (socket.readyState === WebSocket.OPEN) {
        // Create our standardized data contract
        const payload = {
            type: "controller_input",
            beta: beta,
            gamma: gamma,
            alpha: alpha
        };
        // Convert to text and send through the tunnel
        socket.send(JSON.stringify(payload));
    }
};