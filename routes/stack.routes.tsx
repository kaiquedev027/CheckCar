import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CadastroScreen from '../screens/CadastroScreen';
import DetalheScreen from '../screens/DetalheScreen';
import ListaScreen from '../screens/ListaScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Lista"
      screenOptions={{
        headerStyle: { backgroundColor: '#1971c2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Lista" component={ListaScreen} options={{ title: 'CheckCar' }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Nova Vistoria' }} />
      <Stack.Screen name="Detalhe" component={DetalheScreen} options={{ title: 'Detalhe da Vistoria' }} />
    </Stack.Navigator>
  );
}
