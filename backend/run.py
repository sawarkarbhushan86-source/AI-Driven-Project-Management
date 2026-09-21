import os
import sys
import uvicorn

# Get backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))

# Get project root directory
project_root = os.path.dirname(backend_dir)

# Add backend directory to Python path
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Add project root to Python path
if project_root not in sys.path:
    sys.path.insert(0, project_root)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"Starting AI Project Management Backend on {host}:{port}...")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=False
    )