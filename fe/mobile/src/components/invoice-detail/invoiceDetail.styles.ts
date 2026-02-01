import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1E88E5' },
  headerTitle: { color: '#fff', fontWeight: '600' },
  content: { padding: 12 },

  customerCard: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  customerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#90CAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12 },
  customerName: { color: '#fff', fontWeight: '600' },

  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: { color: '#fff' },

  customerRow: { flexDirection: 'row', gap: 16 },
  customerCol: { flex: 1 },

  label: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  value: { color: '#fff', fontWeight: '600' },

  listHeader: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  listHeaderText: { color: '#fff', fontWeight: '600' },

  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  invoiceTitle: { fontWeight: '600', marginBottom: 8 },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  money: { color: '#dc2626', fontWeight: '600' },

  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#1E88E5',
  },
  navBtn: {
    flex: 0.2,
    padding: 14,
    alignItems: 'center',
  },
  navText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  payBtn: {
    flex: 0.6,
    backgroundColor: '#1565C0',
    padding: 14,
    alignItems: 'center',
  },
  payText: { color: '#fff', fontWeight: '600' },
});
