// Environment configuration utility
// This handles environment variables in a way that works in both browser and build environments

interface Config {
  API_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  ENABLE_LOGGING: boolean;
  IS_DEVELOPMENT: boolean;
}

// Default configuration
const defaultConfig: Config = {
  API_URL: 'http://localhost:8080/api',
  APP_NAME: 'StartBusiness Platform',
  APP_VERSION: '1.0.0',
  ENABLE_LOGGING: true,
  IS_DEVELOPMENT: true,
};

// Function to get environment variable value
const getEnvValue = (key: string, defaultValue: string | boolean): string | boolean => {
  // Try to get from window (if available in browser)
  if (typeof window !== 'undefined') {
    const windowEnv = (window as any)[`REACT_APP_${key}`];
    if (windowEnv !== undefined) {
      return typeof defaultValue === 'boolean' ? windowEnv === 'true' : windowEnv;
    }
  }
  
  // Try to get from global (if available)
  if (typeof global !== 'undefined' && (global as any).process?.env) {
    const processEnv = (global as any).process.env[`REACT_APP_${key}`];
    if (processEnv !== undefined) {
      return typeof defaultValue === 'boolean' ? processEnv === 'true' : processEnv;
    }
  }
  
  return defaultValue;
};

// Create configuration object
export const config: Config = {
  API_URL: getEnvValue('API_URL', defaultConfig.API_URL) as string,
  APP_NAME: getEnvValue('APP_NAME', defaultConfig.APP_NAME) as string,
  APP_VERSION: getEnvValue('APP_VERSION', defaultConfig.APP_VERSION) as string,
  ENABLE_LOGGING: getEnvValue('ENABLE_LOGGING', defaultConfig.ENABLE_LOGGING) as boolean,
  IS_DEVELOPMENT: getEnvValue('ENV', 'development') === 'development',
};

// Utility functions
export const isDevelopment = () => config.IS_DEVELOPMENT;

export const getApiUrl = () => config.API_URL;

export const log = (...args: any[]) => {
  if (config.ENABLE_LOGGING) {
    console.log('[StartBusiness]:', ...args);
  }
};

export const logError = (...args: any[]) => {
  if (config.ENABLE_LOGGING) {
    console.error('[StartBusiness Error]:', ...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (config.ENABLE_LOGGING) {
    console.warn('[StartBusiness Warning]:', ...args);
  }
};

// Export for debugging
if (config.IS_DEVELOPMENT && typeof window !== 'undefined') {
  (window as any).startBusinessConfig = config;
}