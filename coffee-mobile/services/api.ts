import { Platform, NativeModules } from "react-native";

/**
 * Base URL бэкенда (админка на Render или локальный сервер в разработке).
 * Production: задайте EXPO_PUBLIC_API_URL в .env (например https://your-app.onrender.com).
 * Dev: если не задано — используется LAN IP текущей машины (для теста с устройством/эмулятором).
 */
const ENV_API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").trim();

/** Для разработки, если EXPO_PUBLIC_API_URL не задан (например локальный Next.js или Express). */
const FALLBACK_LAN_IP = "192.168.1.42";

function getLanIpFromBundler(): string | null {
  const scriptUrl = NativeModules?.SourceCode?.scriptURL;
  if (!scriptUrl) return null;
  const host = scriptUrl.split("://")[1]?.split("/")[0]?.split(":")[0];
  return host || null;
}

export function getBaseUrl(): string {
  if (ENV_API_URL) {
    return ENV_API_URL.replace(/\/$/, "");
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  const lanIp = getLanIpFromBundler() || FALLBACK_LAN_IP;
  return `http://${lanIp}:3000`;
}
