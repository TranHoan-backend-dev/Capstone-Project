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
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  cardHeaderLeft: {
    flexDirection: 'row',
    gap: 16,
  },

  cardIdGroup: {
    alignItems: 'flex-start',
  },

  cardIdLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },

  cardIdValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  cardBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  cardBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  cardCol: {
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

  cardValueDanger: {
    color: '#E53935',
  },

  cardValueSuccess: {
    color: '#4CAF50',
  },
});