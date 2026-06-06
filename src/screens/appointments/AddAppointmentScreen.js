import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../../components/ui';
import { colors, radii, spacing } from '../../theme';

const SPECIALTIES = [
  'Cardiología',
  'Clínica médica',
  'Dermatología',
  'Ginecología',
  'Neurología',
  'Oftalmología',
  'Pediatría',
  'Traumatología',
];

function FormField({ label, value, onChangeText, placeholder, rightIcon, multiline, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldInputRow, multiline && styles.fieldInputMultiline]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? ''}
          placeholderTextColor={colors.neutral300}
          style={[styles.fieldInput, multiline && styles.multilineInput]}
          multiline={multiline}
          keyboardType={keyboardType}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {rightIcon ? (
          <View style={styles.fieldIcon}>
            <Ionicons name={rightIcon} size={18} color={colors.neutral400} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SelectField({ label, value, onPress, icon }) {
  return (
    <Pressable onPress={onPress} style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputRow}>
        <Text style={[styles.fieldInput, !value && { color: colors.neutral300 }]}>
          {value || 'Seleccionar...'}
        </Text>
        <View style={styles.fieldIcon}>
          <Ionicons name={icon ?? 'chevron-down'} size={18} color={colors.neutral400} />
        </View>
      </View>
    </Pressable>
  );
}

function OutlineButton({ label, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.7 }]}
    >
      {icon ? <Ionicons name={icon} size={16} color={colors.neutral600} style={{ marginRight: spacing[2] }} /> : null}
      <Text style={styles.outlineBtnText}>{label}</Text>
    </Pressable>
  );
}

export default function AddAppointmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    specialty: '',
    professional: '',
    center: '',
    date: '',
    time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleReset = () => {
    setForm({ specialty: '', professional: '', center: '', date: '', time: '', notes: '' });
    setStep(1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // TODO: connect to backend when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.replace('/(app)/appointments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing[6] }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Cargar turno</Text>
          <Text style={styles.pageSubtitle}>
            Agregá la información médica de tu próxima consulta
          </Text>
        </View>

        {step === 1 ? (
          <>
            {/* Step 1 card */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Información hospitalaria</Text>

              <SelectField
                label="Especialidad / Motivo"
                value={form.specialty}
                onPress={() => {}}
                icon="heart-outline"
              />

              <FormField
                label="Profesional"
                value={form.professional}
                onChangeText={update('professional')}
                placeholder="Nombre del profesional"
              />

              <FormField
                label="Centro médico"
                value={form.center}
                onChangeText={update('center')}
                placeholder="Nombre o dirección"
                rightIcon="location-outline"
              />

              <Text style={styles.fieldHint}>
                Dropdown y si no se encuentra el deseado, elegir ubicación
              </Text>

              {/* Forward arrow */}
              <Pressable
                onPress={() => setStep(2)}
                style={({ pressed }) => [styles.forwardBtn, pressed && { opacity: 0.8 }]}
              >
                <Ionicons name="arrow-forward-circle" size={42} color={colors.primary} />
              </Pressable>
            </View>

            {/* Bottom action buttons */}
            <View style={styles.bottomActions}>
              <OutlineButton label="Restablecer datos" icon="refresh-outline" onPress={handleReset} />
              <OutlineButton label="Salir" icon="exit-outline" onPress={() => router.back()} />
            </View>
          </>
        ) : (
          <>
            {/* Step 2 header */}
            <Text style={styles.stepSectionHeader}>Información secundaria</Text>

            {/* Step 2 card */}
            <View style={styles.card}>
              <View style={styles.twoColRow}>
                <View style={styles.halfField}>
                  <FormField
                    label="Fecha"
                    value={form.date}
                    onChangeText={update('date')}
                    placeholder="DD/MM/AAAA"
                    rightIcon="chevron-down"
                  />
                </View>
                <View style={styles.halfField}>
                  <FormField
                    label="Hora"
                    value={form.time}
                    onChangeText={update('time')}
                    placeholder="HH:MM"
                    rightIcon="chevron-down"
                  />
                </View>
              </View>

              <FormField
                label="Indicaciones"
                value={form.notes}
                onChangeText={update('notes')}
                placeholder="Notas adicionales..."
                multiline
                rightIcon="arrow-back-outline"
              />
            </View>

            {/* Submit button */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [styles.submitBtn, (pressed || submitting) && { opacity: 0.75 }]}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Cargando...' : 'Cargar turno'}
              </Text>
            </Pressable>

            {/* Back to step 1 */}
            <Pressable onPress={() => setStep(1)} style={styles.backStep}>
              <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
              <Text style={styles.backStepText}>Volver a información hospitalaria</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
  },
  pageHeader: {
    marginBottom: spacing[5],
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepSectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing[3],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing[4],
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing[4],
  },
  field: {
    marginBottom: spacing[4],
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  fieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  fieldInputMultiline: {
    borderRadius: radii.xl,
    alignItems: 'flex-start',
    minHeight: 100,
    paddingVertical: spacing[3],
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 0,
  },
  fieldIcon: {
    marginLeft: spacing[2],
  },
  fieldHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -spacing[2],
    marginBottom: spacing[3],
    lineHeight: 16,
  },
  forwardBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing[2],
  },
  bottomActions: {
    gap: spacing[3],
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    backgroundColor: colors.surface,
  },
  outlineBtnText: {
    fontSize: 15,
    color: colors.neutral600,
    fontWeight: '500',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  halfField: {
    flex: 1,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    paddingVertical: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  backStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  backStepText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
