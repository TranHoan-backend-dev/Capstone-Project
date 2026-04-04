import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    backgroundColor: '#F3F9FF',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EAF2F8',
  },

  userName: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: -4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    color: '#333333',
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
