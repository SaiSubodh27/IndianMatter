#!/usr/bin/env python
"""
Startup script for Ionic Conductivity Predictor API with Stitch UI
This script starts the Flask server that powers the model predictions
"""

import os
import sys
import webbrowser
import time
from threading import Thread

# Add project to path
project_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_path)

def start_flask_server():
    """Start the Flask API server"""
    print("\n" + "="*60)
    print("Starting Ionic Conductivity Predictor API Server")
    print("="*60 + "\n")
    
    import server  # Import after path is set
    server.app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

def open_ui():
    """Open the Stitch UI in browser after a delay"""
    time.sleep(3)  # Wait for server to start
    
    ui_path = os.path.join(project_path, 'stitch_ui', 'Property Prediction Dashboard', 'index.html')
    if os.path.exists(ui_path):
        print(f"\n✓ Opening UI at: {ui_path}")
        webbrowser.open(f'file://{os.path.abspath(ui_path)}')
    else:
        print(f"\n✗ UI file not found at: {ui_path}")

if __name__ == '__main__':
    print("\n🚀 Ionic Conductivity Prediction System")
    print("📊 API will run on http://localhost:5000")
    print("🌐 UI will open automatically...\n")
    
    # Start Flask server in main thread
    # Start browser opening in background thread
    browser_thread = Thread(target=open_ui, daemon=True)
    browser_thread.start()
    
    try:
        start_flask_server()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped.")
        sys.exit(0)
