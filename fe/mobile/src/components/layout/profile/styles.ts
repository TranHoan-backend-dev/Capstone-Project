import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: -8,
    padding: 8,
  },
  backText: { 
    fontSize: 16, 
    color: '#2563EB', 
    fontWeight: '600',
    marginLeft: -4,
  },
  scrollView: { flex: 1 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D2E',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusChip: {
    backgroundColor: '#D1FAE5',
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginHorizontal: 8,
    textAlign: 'center',
  },
  statusIconInner: {
    marginLeft: 4,
    marginRight: -4,
  },
  divider: { 
    backgroundColor: '#F3F4F6', 
    height: 1 
  },
  profileContent: { 
    padding: 20 
  },
  row: { 
    flexDirection: 'row', 
    gap: 16 
  },
  column: { 
    flex: 1 
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  value: { 
    fontSize: 14, 
    color: '#1A1D2E', 
    lineHeight: 20, 
    fontWeight: '500' 
  },
  valueStrong: {
    fontSize: 14,
    color: '#1A1D2E',
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  actionButton: { 
    borderColor: '#E5E7EB', 
    borderRadius: 10, 
    borderWidth: 1 
  },
  actionButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    paddingVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
  },
});

export default styles;
