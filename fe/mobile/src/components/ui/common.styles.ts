import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* HEADER */
  header: {
    backgroundColor: '#1E88E5',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  /* CARD */
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  /* INFO ROW */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
    flex: 1,
    textAlign: 'right',
  },

  divider: {
    marginVertical: 4,
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

  /* BOTTOM BUTTONS */
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  navButton: {
    width: '22%',
    backgroundColor: '#1E88E5',
  },

  leftButton: {},

  rightButton: {},

  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },

  /* ACTION BUTTONS */
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#1E88E5',
  },

  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#546E7A',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#263238',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
