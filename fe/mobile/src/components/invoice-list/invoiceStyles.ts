import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    flex: 1,
    padding: 16,
  },

  /* Section */
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  /* Filter */
  filterButton: {
    borderRadius: 8,
    borderColor: '#ddd',
  },
  filterButtonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },

  /* Search */
  searchbar: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },

  /* Card */
  card: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoiceCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  /* Chip */
  collectChip: {
    backgroundColor: '#e8f5e9',
    height: 28,
  },
  collectText: {
    color: '#16a34a',
    fontSize: 12,
  },

  /* Info */
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  phoneLabel: {
    color: '#555',
  },
  phoneNumber: {
    fontWeight: '500',
    color: '#333',
  },

  /* Summary */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bold: {
    fontWeight: '600',
  },
  redText: {
    color: '#dc2626',
  },

  /* Status */
  statusBadge: {
    paddingVertical: 10,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
});
