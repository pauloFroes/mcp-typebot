function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Error: Missing required environment variable: ${name}\n` +
        "  TYPEBOT_API_KEY is required.\n" +
        "  Get your API token at: https://app.typebot.io → Settings & Members → My account → API tokens"
    );
    process.exit(1);
  }
  return value;
}

export const API_KEY = getRequiredEnv("TYPEBOT_API_KEY");
export const APP_BASE_URL = "https://app.typebot.io/api";
export const CHAT_BASE_URL = "https://typebot.io/api";
