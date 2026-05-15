type RuntimeConfig = {
  API_BASE_URL?: string;
};

const runtimeConfig = globalThis as typeof globalThis & {
  UPSPOT_CONFIG?: RuntimeConfig;
};

const defaultApiBaseUrl =
  typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/api`
    : 'http://localhost:3000/api';

export const environments = {
  production: false,
  featureFlag: false,
  API_BASE_URL: runtimeConfig.UPSPOT_CONFIG?.API_BASE_URL || defaultApiBaseUrl,
  PUBLIC_KEY: 'dbb7b572c497b6e404a8968cae9f8433',
};