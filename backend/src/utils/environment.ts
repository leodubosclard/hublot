export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const environment = process.env.NODE_ENV || Environment.DEVELOPMENT;

export const appConstants = {
  environment,
  isProduction: environment === Environment.PRODUCTION,
  isDevelopment: environment === Environment.DEVELOPMENT,
};

export const openaiConstants = {
  apiKey: process.env.OPENAI_API_KEY,
};
