import { AuthState, authAtom } from "./atoms/auth";
import { useAsyncStorage } from "./hooks/useAsyncStorage";
import { persistor, store } from "./redux/Store/store";
import { Router } from "./routes";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme } from "react-native";
import { ThemeProvider as MagnusThemeProvider } from "react-native-magnus";
import { Provider } from "react-redux";
import { RecoilRoot } from "recoil";
import { PersistGate } from "redux-persist/integration/react";

export function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [initRes, setInitRes] = useState<AuthState | null>(null);
  const asyncStorage = useAsyncStorage();

  const checkSignIn = useCallback(async () => {
    const token = await asyncStorage.getString("token");
    setInitRes({ isAuthenticated: !!token });
  }, []);

  useEffect(() => {
    checkSignIn();
  }, []);

  if (!initRes) return <ActivityIndicator size="large" />;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RecoilRoot initializeState={({ set }) => set(authAtom, initRes)}>
            <MagnusThemeProvider
              theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Router />
            </MagnusThemeProvider>
          </RecoilRoot>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
