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
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  cardContent: {
    paddingVertical: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sttSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sttIcon: {
    marginRight: 8,
  },

  sttText: {
    color: '#1E88E5',
    fontWeight: '700',
    fontSize: 16,
  },

  photoButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 6,
  },

  photoButtonLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    marginHorizontal: 8,
    marginVertical: 4,
  },

  infoSection: {
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoIcon: {
    marginRight: 8,
  },

  customerName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 15,
  },

  customerAddress: {
    color: '#555',
    flex: 1,
    fontSize: 13,
  },

  dateText: {
    color: '#555',
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statLabel: {
    color: '#555',
    fontSize: 14,
  },

  statValue: {
    color: '#333',
    fontSize: 14,
    marginLeft: 4,
  },

  m3Value: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    marginRight: 6,
  },

  statusText: {
    fontWeight: '700',
    fontSize: 16,
  },

  statusDone: {
    color: '#4CAF50',
  },

  statusPending: {
    color: '#F59E0B',
  },

  statusAlert: {
    color: '#EF4444',
  },

  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  amountLabel: {
    color: '#555',
    fontSize: 14,
  },

  amountValue: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
});
