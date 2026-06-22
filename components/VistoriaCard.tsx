import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Vistoria } from '../types/vistoria';

type Props = {
  vistoria: Vistoria;
  onPress: () => void;
};

export default function VistoriaCard({ vistoria, onPress }: Props) {
  const tipoLabel = vistoria.tipo === 'saida' ? 'Saída' : 'Devolução';
  const tipoColor = vistoria.tipo === 'saida' ? '#1971c2' : '#0ca678';
  const primeiraFoto = vistoria.fotos[0] ?? null;
  const totalFotos = vistoria.fotos.length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.fotoContainer}>
        {primeiraFoto ? (
          <>
            <Image source={{ uri: primeiraFoto }} style={styles.foto} />
            {totalFotos > 1 && (
              <View style={styles.fotoBadge}>
                <Text style={styles.fotoBadgeTexto}>+{totalFotos - 1}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={[styles.foto, styles.semFoto]}>
            <Text style={styles.semFotoTexto}>sem foto</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.cabecalho}>
          <Text style={styles.placa}>{vistoria.placa}</Text>
          <View style={[styles.badge, { backgroundColor: tipoColor }]}>
            <Text style={styles.badgeTexto}>{tipoLabel}</Text>
          </View>
        </View>
        <Text style={styles.modelo} numberOfLines={1}>{vistoria.modelo}</Text>
        <Text style={styles.cliente} numberOfLines={1}>Cliente: {vistoria.cliente}</Text>
        {totalFotos > 0 && (
          <Text style={styles.fotoInfo}>📷 {totalFotos} foto{totalFotos > 1 ? 's' : ''}</Text>
        )}
        {vistoria.latitude != null && vistoria.longitude != null && (
          <Text style={styles.coord}>📍 {vistoria.latitude.toFixed(4)}, {vistoria.longitude.toFixed(4)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  fotoContainer: {
    width: 72,
    height: 72,
    position: 'relative',
  },
  foto: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#e9ecef' },
  semFoto: { alignItems: 'center', justifyContent: 'center' },
  semFotoTexto: { color: '#adb5bd', fontSize: 11 },
  fotoBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  fotoBadgeTexto: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placa: { fontSize: 17, fontWeight: 'bold', color: '#212529', letterSpacing: 1 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  modelo: { color: '#495057', marginTop: 2, fontSize: 13 },
  cliente: { color: '#868e96', fontSize: 12, marginTop: 2 },
  fotoInfo: { color: '#1971c2', fontSize: 11, marginTop: 3 },
  coord: { color: '#495057', fontSize: 11, marginTop: 2 },
});
