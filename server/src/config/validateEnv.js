const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];

// Fails fast and loudly if required config is missing, instead of letting
// the server start in a half-working state (e.g. auth silently broken).
export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('\n[startup] Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('\nCopy .env.example to .env and fill these in before starting the server.\n');
    process.exit(1);
  }
}
