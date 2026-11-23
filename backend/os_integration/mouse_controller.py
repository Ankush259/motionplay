from pynput.mouse import Controller

class MouseEngine:
    def __init__(self):
        self.mouse = Controller()
        # Higher sensitivity because we are now measuring tiny frame-by-frame changes
        self.sensitivity = 20 
        
        # Track the phone's previous position to calculate movement
        self.prev_beta = None
        self.prev_gamma = None

    def process_tilt(self, beta, gamma):
        # 1. If this is the very first frame, just memorize the starting position
        if self.prev_beta is None or self.prev_gamma is None:
            self.prev_beta = beta
            self.prev_gamma = gamma
            return

        # 2. Calculate the 'Delta' (how much the angle changed since the last frame)
        delta_beta = beta - self.prev_beta
        delta_gamma = gamma - self.prev_gamma

        # 3. Save the current position for the next frame's math
        self.prev_beta = beta
        self.prev_gamma = gamma

        # If the phone hasn't rotated, don't move the mouse
        if delta_beta == 0 and delta_gamma == 0:
            return

        # 4. Map the angle change to pixel movement
        dx = delta_gamma * self.sensitivity
        
        # Tilting forward (positive beta change) moves the cursor DOWN the screen
        # Tilting backward (negative beta change) moves the cursor UP the screen
        dy = delta_beta * self.sensitivity

        # 5. Move the Mac cursor
        self.mouse.move(dx, dy)