export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const appConstants = {
  environment: process.env.NODE_ENV || Environment.DEVELOPMENT,
  isProduction: process.env.NODE_ENV === Environment.PRODUCTION,
  isDevelopment: process.env.NODE_ENV === Environment.DEVELOPMENT,
};

export const openaiConstants = {
  apiKey: process.env.OPENAI_API_KEY,
};
