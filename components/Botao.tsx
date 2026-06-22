import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
};

export default function Botao({ titulo, onPress, variante = 'primario' }: Props) {
  return (
    <TouchableOpacity style={[styles.botao, styles[variante]]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { paddingVertical: 13, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', marginVertical: 6 },
  primario: { backgroundColor: '#1971c2' },
  secundario: { backgroundColor: '#0ca678' },
  perigo: { backgroundColor: '#c92a2a' },
  texto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
