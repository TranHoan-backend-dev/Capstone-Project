import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F7',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },

  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cardButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#333',
  },
});
