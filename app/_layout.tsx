import { Stack } from "expo-router";

import { ThemeToggle } from "../src/components/ThemeToggle";
import { AppThemeProvider, useAppTheme } from "../src/theme/ThemeProvider";

function RootNavigator() {
  const { theme } = useAppTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
      <ThemeToggle />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  );
}
