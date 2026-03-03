function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Error: Missing required environment variable: ${name}\n` +
        "  TYPEBOT_API_KEY is required.\n" +
        "  Get your API token at: your Typebot dashboard → Settings & Members → My account → API tokens\n" +
        "  For self-hosted: also set TYPEBOT_BASE_URL to your instance URL (e.g. https://bot.example.com)"
    );
    process.exit(1);
  }
  return value;
}

export const API_KEY = getRequiredEnv("TYPEBOT_API_KEY");

// Self-hosted support: single base URL that serves both app and chat APIs
// For cloud: APP = https://app.typebot.io, CHAT = https://typebot.io
// For self-hosted: both use the same domain (e.g. https://bot.example.com)
const customBaseUrl = process.env.TYPEBOT_BASE_URL;

export const APP_BASE_URL = customBaseUrl
  ? `${customBaseUrl.replace(/\/$/, "")}/api`
  : "https://app.typebot.io/api";

export const CHAT_BASE_URL = customBaseUrl
  ? `${customBaseUrl.replace(/\/$/, "")}/api`
  : "https://typebot.io/api";
