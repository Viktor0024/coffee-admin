import { useColorScheme as useRNColorScheme } from 'react-native';

/** Always returns 'light' so the app never uses black/dark theme. */
export function useColorScheme() {
  useRNColorScheme(); // keep reactive to avoid stripping
  return 'light' as const;
}
