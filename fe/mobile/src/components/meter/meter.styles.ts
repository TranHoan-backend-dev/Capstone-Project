import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F7',
  },

  header: {
    backgroundColor: '#0288D1',
    elevation: 1,
  },

  notifyText: {
    marginRight: 12,
    fontSize: 12,
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },

  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    borderRadius: 16,
    elevation: 2,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
