import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { inicializarBanco } from './database/database';
import StackRoutes from './routes/stack.routes';

export default function App() {
  return (
    <SQLiteProvider databaseName="checkcar.db" onInit={inicializarBanco}>
      <NavigationContainer>
        <StatusBar style="light" />
        <StackRoutes />
      </NavigationContainer>
    </SQLiteProvider>
  );
}
