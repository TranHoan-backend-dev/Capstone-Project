import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: { fontSize: 15, color: '#2563EB', fontWeight: '500' },

  titleSection: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 15, color: '#6B7280' },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#FFF',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
  },

  requirementsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  requirementsTitle: { fontWeight: '600', marginBottom: 12 },

  requirement: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginRight: 10 },
  bulletActive: { backgroundColor: '#F59E0B' },
  bulletInactive: { backgroundColor: '#D1D5DB' },

  requirementText: { color: '#6B7280' },
  requirementTextActive: { color: '#374151' },
  recommended: { fontStyle: 'italic', color: '#9CA3AF' },

  actionsContainer: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, borderRadius: 8 },
  cancelButtonLabel: { fontWeight: '600' },
  saveButton: { flex: 1, borderRadius: 8 },
  saveButtonLabel: { fontWeight: '600' },
});
