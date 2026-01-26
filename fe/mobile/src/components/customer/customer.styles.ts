import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* CONTAINER */
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    flex: 1,
    padding: 12,
  },

  /* HEADER */
  header: {
    backgroundColor: '#1E88E5',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  /* FILTER */
  filterContainer: {
    marginBottom: 16,
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  filterButton: {
    borderColor: '#E0E0E0',
  },

  filterButtonMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    backgroundColor: '#F9F9F9',
  },

  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  menuItem: {
    paddingVertical: 4,
  },

  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  menuItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },

  /* SEARCH */
  searchbar: {
    marginVertical: 12,
    marginBottom: 16,
  },

  /* CARD */
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  idSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  customerId: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },

  stt: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  inputButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 4,
  },

  inputButtonLabel: {
    fontSize: 12,
  },

  infoSection: {
    marginBottom: 12,
    gap: 6,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  customerName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },

  customerAddress: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },

  date: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  statItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 12,
  },

  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
    marginLeft: 4,
  },

  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },

  amountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  amountLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  amountValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E53935',
  },
});
