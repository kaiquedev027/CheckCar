import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import Botao from '../components/Botao';
import VistoriaCard from '../components/VistoriaCard';
import { listarVistorias } from '../repositories/vistoriaRepository';
import { RootStackParamList } from '../types/navigation';
import { Vistoria } from '../types/vistoria';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

export default function ListaScreen({ navigation }: Props) {
  const db = useSQLiteContext();
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, []),
  );

  async function carregar() {
    const dados = await listarVistorias(db);
    setVistorias(dados);
  }

  return (
    <View style={styles.container}>
      <Botao titulo="+ Nova Vistoria" onPress={() => navigation.navigate('Cadastro')} />

      {vistorias.length === 0 ? (
        <Text style={styles.vazio}>
          Nenhuma vistoria registrada ainda.{'\n'}Toque em "Nova Vistoria" para começar.
        </Text>
      ) : (
        <FlatList
          data={vistorias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <VistoriaCard vistoria={item} onPress={() => navigation.navigate('Detalhe', { id: item.id })} />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f3f5' },
  vazio: { textAlign: 'center', color: '#868e96', marginTop: 40, lineHeight: 22 },
});
