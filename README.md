# CheckCar — Aplicativo de Vistoria de Veículos

Aplicativo móvel desenvolvido em React Native com Expo para registrar vistorias de veículos em locadoras de automóveis.

## Objetivo

Digitalizar o processo de vistoria de veículos, permitindo documentar o estado do carro na **saída** e na **devolução** com foto, quilometragem, observações e localização GPS — substituindo fichas físicas por um registro digital confiável e persistente.

## Integrantes

- Kaique Fernandes e João Leal

## Disciplina

Programação Para Dispositivos Móveis 1 — Instituto Federal de Mato Grosso do Sul (IFMS)

## Funcionalidades

- Cadastro de vistorias com placa, modelo, cliente, tipo (saída/devolução), KM e observações
- Fotografia do veículo diretamente pela câmera do dispositivo
- Captura de coordenadas GPS com abertura no Google Maps
- Listagem de todas as vistorias em cards
- Visualização detalhada, edição e exclusão de registros
- Persistência local com SQLite (funciona sem internet)

## Tecnologias Utilizadas

- React Native + Expo SDK 54
- TypeScript
- expo-sqlite (banco de dados local)
- expo-image-picker (câmera)
- expo-location (GPS)
- React Navigation — Stack Navigator

## Como executar

```bash
npm install
npx expo start
```

Escaneie o QR Code com o aplicativo **Expo Go** no seu celular.
