# app/main.py
import os
import logging
import importlib
from typing import List 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

#Load .env from the root directory
load_dotenv()

# ---------------------------
# Logging setup
# ---------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
  level=LOG_LEVEL,
  format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("bryium_ai_backend")

# ---------------------------
# App factory
# ---------------------------
def create_app() -> FastAPI:
    app = FastAPI(
        title="Bryium AI Backend",
        description="Backend service for Bryium AI assistant",
        version="1.0.0",
    )

    # ---------------------------
    # CORS setup
    # ---------------------------
    allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
    if allowed_origins_env:
        allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    else:
        allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

    logger.info("Allowed CORS origins: %s", allowed_origins)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -----------------------
    # Health route (always present)
    # -----------------------
    @app.get("/health", tags=["health"])
    async def health():
        return {"status": "ok", "service": "bryium-ai-backend"}
    

    # ---------------------------
    # This keeps main.py robust if route modules are not yet created.
    # ---------------------------
    route_modules = [
        "app.routes.auth",
        "app.routes.chat",
        "app.routes.upload",
        "app.routes.search",
    ]

    for module_name in route_modules:
        try:
            module = importlib.import_module(module_name)
            router = getattr(module, "router", None)
            if router:
                app.include_router(router)
                logger.info("Included router from %s", module_name)
            else:
                logger.warning("Module %s does not export 'router'", module_name)
        except ModuleNotFoundError as e:
            logger.warning("Module %s not found (skipping): %s", module_name, e)
        except Exception as e:
            logger.error("Error importing module %s: %s", module_name, e)


    #-----------------------
    # Startup / shutdown event hooks (placeholders)
    # -----------------------
    @app.on_event("startup")
    async def on_startup():
        logger.info("Starting up Bryium AI Backend (startup event)")


    @app.on_event("shutdown")
    async def on_shutdown():
        logger.info("Shutting down Bryium AI Backend (shutdown event)")

    return app

#create the FastAPI app instance
app = create_app()

# Run with: python -m app.main  (useful in local dev only)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)

