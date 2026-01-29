import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    backgroundColor: '#0288D1',
    paddingHorizontal: 8,
  },

  userName: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },

  watermark: {
    alignItems: 'center',
    marginVertical: 32,
  },

  watermarkText: {
    fontSize: 48,
    color: '#E0E0E0',
    fontWeight: 'bold',
    letterSpacing: 4,
  },

  bottomTab: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },

  tabItemActive: {
    flex: 1,
    alignItems: 'center',
  },

  activeText: {
    color: '#1E88E5',
    fontSize: 12,
  },
});
