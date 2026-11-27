import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { LocationPermissionAlert } from '@/components/alert-location-permission';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();

async function iniciarDataBase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS locais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    imagem_uri TEXT);
  `);
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <SQLiteProvider databaseName="elders.db" onInit={iniciarDataBase}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LocationPermissionAlert/>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
