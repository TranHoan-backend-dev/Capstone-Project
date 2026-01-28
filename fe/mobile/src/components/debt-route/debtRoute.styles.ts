import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#1E88E5',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    padding: 12,
  },

  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  tabButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },

  tabButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },

  tabButtonTextActive: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  filterSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  filterItem: {
    flex: 1,
  },

  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  filterButton: {
    borderColor: '#E0E0E0',
    height: 40,
    justifyContent: 'center',
  },

  filterButtonText: {
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },

  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  cardLeft: {
    flex: 1,
  },

  cardLeftRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },

  cardIdGroup: {
    alignItems: 'flex-start',
  },

  cardIdLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
    fontWeight: '500',
  },

  cardIdValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  cardCustomerId: {
    fontSize: 13,
    color: '#1E88E5',
    fontWeight: '600',
  },

  cardMeterId: {
    fontSize: 12,
    color: '#666',
  },

  cardRight: {
    flex: 1,
    alignItems: 'flex-start',
  },

  cardBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },

  cardBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },

  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  cardDataPair: {
    flex: 1,
  },

  cardLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },

  cardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },

  cardValueRed: {
    color: '#E53935',
  },

  cardValueGreen: {
    color: '#4CAF50',
  },

  // Detailed data section
  detailSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  detailCol: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },

  detailValueRed: {
    color: '#E53935',
  },
});
