export interface AppConfig {
  API_URL: string;
  DEFAULT_API_INTERVAL: number;
}

const gwUrl = import.meta.env.VITE_GATEWAY_URL;
export const APP_CONFIG: AppConfig = {
  API_URL: `${gwUrl}/api/v1`,
  DEFAULT_API_INTERVAL: 60000,
};
