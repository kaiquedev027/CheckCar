import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Botao from '../components/Botao';
import { atualizarVistoria, buscarVistoria, inserirVistoria } from '../repositories/vistoriaRepository';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

const MAX_FOTOS = 5;

export default function CadastroScreen({ route, navigation }: Props) {
  const db = useSQLiteContext();
  const editId = route.params?.id ?? null;

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState<'saida' | 'devolucao'>('saida');
  const [km, setKm] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    if (editId != null) {
      navigation.setOptions({ title: 'Editar Vistoria' });
      buscarVistoria(db, editId).then((v) => {
        if (!v) return;
        setPlaca(v.placa);
        setModelo(v.modelo);
        setCliente(v.cliente);
        setTipo(v.tipo);
        setKm(v.km != null ? String(v.km) : '');
        setObservacoes(v.observacoes);
        setFotos(v.fotos);
        setLatitude(v.latitude);
        setLongitude(v.longitude);
      });
    }
  }, []);

  async function tirarFoto() {
    if (fotos.length >= MAX_FOTOS) {
      Alert.alert('Limite atingido', `Você já adicionou ${MAX_FOTOS} fotos do veículo.`);
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos acessar a câmera para fotografar o veículo.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: false });
    if (resultado.canceled) return;
    setFotos((prev) => [...prev, resultado.assets[0].uri]);
  }

  function removerFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function capturarLocalizacao() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos acessar a localização para registrar o local da vistoria.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
  }

  async function salvar() {
    if (placa.trim() === '' || modelo.trim() === '' || cliente.trim() === '') {
      Alert.alert('Atenção', 'Preencha a placa, o modelo e o cliente.');
      return;
    }
    const dados = {
      placa: placa.toUpperCase().trim(),
      modelo: modelo.trim(),
      cliente: cliente.trim(),
      tipo,
      km: km !== '' ? parseInt(km, 10) : null,
      observacoes: observacoes.trim(),
      fotos,
      latitude,
      longitude,
      criadoEm: new Date().toISOString(),
    };
    if (editId != null) {
      await atualizarVistoria(db, editId, dados);
    } else {
      await inserirVistoria(db, dados);
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Placa</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: ABC-1234"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Fiat Uno 2020"
        value={modelo}
        onChangeText={setModelo}
      />

      <Text style={styles.label}>Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do locatário"
        value={cliente}
        onChangeText={setCliente}
      />

      <Text style={styles.label}>Tipo de Vistoria</Text>
      <View style={styles.tipoContainer}>
        <Botao
          titulo="Saída"
          variante={tipo === 'saida' ? 'primario' : 'secundario'}
          onPress={() => setTipo('saida')}
        />
        <View style={{ width: 8 }} />
        <Botao
          titulo="Devolução"
          variante={tipo === 'devolucao' ? 'primario' : 'secundario'}
          onPress={() => setTipo('devolucao')}
        />
      </View>

      <Text style={styles.label}>KM Atual</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 45000"
        value={km}
        onChangeText={setKm}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.area]}
        placeholder="Descreva avarias, riscos, amassados..."
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <Text style={styles.label}>
        Fotos do Veículo ({fotos.length}/{MAX_FOTOS})
      </Text>

      {fotos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fotosScroll}
          contentContainerStyle={styles.fotosConteudo}
        >
          {fotos.map((uri, index) => (
            <View key={index} style={styles.fotoWrapper}>
              <Image source={{ uri }} style={styles.previaFoto} />
              <TouchableOpacity
                style={styles.removerBtn}
                onPress={() => removerFoto(index)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.removerTexto}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.fotoNumero}>{index + 1}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {fotos.length < MAX_FOTOS ? (
        <Botao
          titulo={fotos.length === 0 ? 'Fotografar veículo' : `Adicionar foto (${fotos.length}/${MAX_FOTOS})`}
          variante="secundario"
          onPress={tirarFoto}
        />
      ) : (
        <View style={styles.limiteContainer}>
          <Text style={styles.limiteTexto}>✓ Limite de {MAX_FOTOS} fotos atingido</Text>
        </View>
      )}

      <Botao
        titulo={latitude != null ? 'Atualizar localização' : 'Capturar localização'}
        variante="secundario"
        onPress={capturarLocalizacao}
      />
      {latitude != null && longitude != null && (
        <Text style={styles.coord}>📍 {latitude.toFixed(5)}, {longitude.toFixed(5)}</Text>
      )}

      <Botao titulo="Salvar Vistoria" onPress={salvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f1f3f5' },
  label: { fontWeight: 'bold', color: '#343a40', marginTop: 10, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    fontSize: 15,
  },
  area: { height: 100, textAlignVertical: 'top' },
  tipoContainer: { flexDirection: 'row', marginVertical: 4 },
  fotosScroll: { marginVertical: 8 },
  fotosConteudo: { paddingRight: 8 },
  fotoWrapper: { position: 'relative', marginRight: 10 },
  previaFoto: { width: 100, height: 100, borderRadius: 8 },
  removerBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#c92a2a',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  removerTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  fotoNumero: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  limiteContainer: {
    backgroundColor: '#d3f9d8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  limiteTexto: { color: '#2f9e44', fontWeight: 'bold', fontSize: 13 },
  coord: { color: '#1971c2', fontWeight: 'bold', marginVertical: 6 },
});
