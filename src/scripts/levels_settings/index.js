import { APP_ENV } from "../app_settings";

// Note: Dynamic import required to include a file extension
export const { LEVELS, FORCE_DEFAULT_LEVEL_NUMBER } = await import(`./env_settings/${APP_ENV}.js`);
