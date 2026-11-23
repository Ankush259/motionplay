from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import uvicorn
import json
import os
from pathlib import Path

# NEW: Import our Mouse Engine
from os_integration.mouse_controller import MouseEngine

app = FastAPI(title="MotionPlay Backend")

# NEW: Create an instance of the mouse controller
mouse_engine = MouseEngine()

BASE_DIR = Path(__file__).resolve().parent.parent
MOBILE_DIR = BASE_DIR / "mobile_controller"
app.mount("/mobile", StaticFiles(directory=str(MOBILE_DIR)), name="mobile")

@app.get("/")
def read_root():
    return RedirectResponse(url="/mobile/index.html")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("\n🟢 [CONNECTED] Phone securely connected to MotionPlay!")
    try:
        while True:
            data = await websocket.receive_text()
            sensor_data = json.loads(data)
            
            beta = sensor_data.get('beta', 0)
            gamma = sensor_data.get('gamma', 0)
            print(f"🎮 Tilt Front/Back: {beta}° | Tilt Left/Right: {gamma}°    ", end="\r")
            
            # NEW: Send the live angles to the Mouse Engine!
            mouse_engine.process_tilt(beta, gamma)
            
    except WebSocketDisconnect:
        print("\n🔴 [DISCONNECTED] Phone disconnected.")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)