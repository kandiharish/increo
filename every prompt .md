The deployed backend is returning a CORS preflight 400 even though BACKEND_CORS_ORIGINS is configured in Render.

Please audit the FastAPI CORS configuration.

Check the following:

1. Is BACKEND_CORS_ORIGINS actually being loaded from the Render environment variables?
2. Print/log the value of settings.BACKEND_CORS_ORIGINS during application startup.
3. Verify CORSMiddleware is configured using:
   allow_origins=settings.BACKEND_CORS_ORIGINS
4. Verify no trailing slash normalization issues exist.
5. Verify allow_methods includes "*".
6. Verify allow_headers includes "*".
7. Verify allow_credentials=True.
8. Verify no middleware registered after CORSMiddleware overrides OPTIONS requests.
9. Explain exactly why the browser preflight receives HTTP 400.

Do not guess. Trace the complete OPTIONS request lifecycle.