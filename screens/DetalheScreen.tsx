import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import Botao from '../components/Botao';
import { buscarVistoria, excluirVistoria } from '../repositories/vistoriaRepository';
import { RootStackParamList } from '../types/navigation';
import { Vistoria } from '../types/vistoria';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

export default function DetalheScreen({ route, navigation }: Props) {
  const db = useSQLiteContext();
  const { id } = route.params;
  const [vistoria, setVistoria] = useState<Vistoria | null>(null);

  useEffect(() => {
    buscarVistoria(db, id).then(setVistoria);
  }, []);

  function abrirNoMapa() {
    if (vistoria?.latitude == null || vistoria.longitude == null) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${vistoria.latitude},${vistoria.longitude}`;
    Linking.openURL(url);
  }

  function confirmarExclusao() {
    Alert.alert('Excluir', 'Deseja remover esta vistoria?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirVistoria(db, id);
          navigation.goBack();
        },
      },
    ]);
  }

  if (!vistoria) {
    return <Text style={styles.carregando}>Carregando...</Text>;
  }

  const tipoLabel = vistoria.tipo === 'saida' ? 'Saída' : 'Devolução';
  const tipoColor = vistoria.tipo === 'saida' ? '#1971c2' : '#0ca678';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.placa}>{vistoria.placa}</Text>
        <View style={[styles.badge, { backgroundColor: tipoColor }]}>
          <Text style={styles.badgeTexto}>{tipoLabel}</Text>
        </View>
      </View>

      <Text style={styles.modelo}>{vistoria.modelo}</Text>
      <Text style={styles.campo}>Cliente: <Text style={styles.valor}>{vistoria.cliente}</Text></Text>
      {vistoria.km != null && (
        <Text style={styles.campo}>KM: <Text style={styles.valor}>{vistoria.km.toLocaleString('pt-BR')} km</Text></Text>
      )}
      {vistoria.observacoes !== '' && (
        <Text style={styles.campo}>Observações: <Text style={styles.valor}>{vistoria.observacoes}</Text></Text>
      )}

      {vistoria.fotos.length > 0 && (
        <View style={styles.fotosSecao}>
          <Text style={styles.fotosTitulo}>
            Fotos do Veículo ({vistoria.fotos.length}/{5})
          </Text>
          {vistoria.fotos.map((uri, index) => (
            <View key={index} style={styles.fotoContainer}>
              <Image source={{ uri }} style={styles.foto} />
              <View style={styles.fotoIndexBadge}>
                <Text style={styles.fotoIndexTexto}>{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {vistoria.latitude != null && vistoria.longitude != null && (
        <>
          <Text style={styles.coord}>📍 {vistoria.latitude.toFixed(5)}, {vistoria.longitude.toFixed(5)}</Text>
          <Botao titulo="Ver no mapa" variante="secundario" onPress={abrirNoMapa} />
        </>
      )}

      <Text style={styles.data}>Registrado em {new Date(vistoria.criadoEm).toLocaleString('pt-BR')}</Text>

      <Botao titulo="Editar" variante="primario" onPress={() => navigation.navigate('Cadastro', { id: vistoria.id })} />
      <Botao titulo="Excluir" variante="perigo" onPress={confirmarExclusao} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f1f3f5' },
  carregando: { padding: 24, textAlign: 'center', color: '#868e96' },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  placa: { fontSize: 26, fontWeight: 'bold', color: '#212529', letterSpacing: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  badgeTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  modelo: { fontSize: 16, color: '#495057', marginBottom: 10 },
  campo: { fontSize: 14, color: '#868e96', marginTop: 4 },
  valor: { color: '#212529', fontWeight: '500' },
  fotosSecao: { marginTop: 16, marginBottom: 4 },
  fotosTitulo: { fontWeight: 'bold', color: '#343a40', marginBottom: 10, fontSize: 14 },
  fotoContainer: { position: 'relative', marginBottom: 10 },
  foto: { width: '100%', height: 220, borderRadius: 10 },
  fotoIndexBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fotoIndexTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  coord: { color: '#1971c2', fontWeight: 'bold', marginTop: 6 },
  data: { color: '#868e96', fontSize: 12, marginTop: 12, marginBottom: 8 },
});
