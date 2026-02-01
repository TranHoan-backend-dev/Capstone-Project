import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    backgroundColor: '#1E88E5',
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    margin: 12,
  },

  /* FILTER */
  filterContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  filterItem: {
    width: '32%',
  },

  filterLabel: {
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
  },

  filterButton: {
    justifyContent: 'space-between',
  },

  filterButtonMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    backgroundColor: '#F9F9F9',
  },

  filterButtonText: {
    fontSize: 13,
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
    fontSize: 13,
    color: '#333',
    flex: 1,
  },

  /* LIST */
  list: {
    paddingBottom: 80,
  },

  /* CARD */
  card: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  routeIdContainer: {
    flex: 1,
  },

  routeId: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
  },

  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },

  actionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },

  /* STATS GRID */
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,

  },

  statItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E88E5',
    marginLeft: 4,
    textAlign: 'right',
    minWidth: 60,
  },

  priceValue: {
    color: '#E53935',
  },

  /* FOOTER */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 12,
  },

  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },

  footerStatGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
  },

  footerLabel: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    flex: 1,
  },

  footerValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 8,
    textAlign: 'right',
    minWidth: 80,
  },

  footerAmount: {
    color: '#FFE082',
  },

  footerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
