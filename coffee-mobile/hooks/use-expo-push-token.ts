import { useEffect, useState } from "react";
import Constants from "expo-constants";

/**
 * Request notification permissions and return Expo Push Token.
 * Returns null if not a physical device, permissions denied, projectId missing, or native push module unavailable (e.g. Expo Go).
 */
export function useExpoPushToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function register() {
      // В Expo Go нативные модули expo-device/expo-notifications могут отсутствовать — пуш не используем
      if (Constants.appOwnership === "expo") return;

      let isPhysicalDevice = false;
      try {
        const Device = require("expo-device");
        isPhysicalDevice = Device.isDevice === true;
      } catch {
        // нативный модуль недоступен
      }
      if (!isPhysicalDevice) return;

      try {
        const Notifications = require("expo-notifications");
        const { status: existing } = await Notifications.getPermissionsAsync();
        let final = existing;
        if (existing !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          final = status;
        }
        if (final !== "granted") return;

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId ??
          require("../../app.json").expo?.extra?.eas?.projectId;
        if (!projectId) {
          if (__DEV__) {
            console.warn(
              "[useExpoPushToken] EAS projectId not set. Add extra.eas.projectId in app.json for push."
            );
          }
          return;
        }

        const pushToken = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        if (mounted && pushToken?.data) {
          setToken(pushToken.data);
        }
      } catch (e) {
        if (__DEV__) {
          console.warn("[useExpoPushToken] skipped (e.g. native module missing):", e);
        }
      }
    }

    register();
    return () => {
      mounted = false;
    };
  }, []);

  return token;
}
