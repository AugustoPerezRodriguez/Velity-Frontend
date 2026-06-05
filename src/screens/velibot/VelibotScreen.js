import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, Input, Screen, Text } from '../../components/ui';
import { colors, spacing } from '../../theme';

// TODO: conectar cuando el backend esté listo
const MOCK_MESSAGES = [
  { id: '1', role: 'bot', text: '¡Hola! Soy Velibot, tu asistente de salud. ¿En qué puedo ayudarte hoy?' },
  { id: '2', role: 'user', text: '¿Cuándo es mi próximo turno?' },
  { id: '3', role: 'bot', text: 'Según tu agenda, tu próximo turno es el 12 de junio con la Dra. González (Cardiología).' },
];

export default function VelibotScreen() {
  const [input, setInput] = useState('');

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.header}>
        <Text variant="h2">Velibot</Text>
        <Text variant="bodySmall">Asistente virtual de salud</Text>
      </View>

      <View style={styles.chatArea}>
        {MOCK_MESSAGES.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}
          >
            <Text variant="body" style={msg.role === 'user' ? styles.userText : undefined}>
              {msg.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.inputArea}>
        <Input
          value={input}
          onChangeText={setInput}
          placeholder="Escribí tu consulta..."
          containerStyle={styles.inputContainer}
        />
        <Button title="Enviar" size="sm" onPress={() => setInput('')} />
      </View>

      <Card style={styles.todoCard}>
        <Text variant="bodySmall">
          {/* TODO: conectar cuando el backend esté listo */}
          Chat de demostración con respuestas mock. Velibot se conectará al backend cuando el endpoint esté
          disponible.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: spacing[4],
  },
  header: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing[3],
    borderRadius: 16,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral100,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  userText: {
    color: colors.textInverse,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  todoCard: {
    margin: spacing[4],
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
});
