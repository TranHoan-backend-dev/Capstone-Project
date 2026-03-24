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
  },

  formContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 12,
    paddingBottom: 220, 
  },

  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  /* INFO DISPLAY */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  customerNameHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E88E5',
    marginLeft: 8,
    flex: 1,
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

  infoRowWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoPart: {
    flex: 1,
  },

  sttBadge: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },

  sttText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },

  sttValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },

  divider: {
    marginVertical: 4,
  },

  /* HEADER WITH STT BADGE */
  headerWithBadge: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  sttBadgeTop: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 50,
  },

  /* DROPDOWN */
  dropdownContainer: {
    paddingVertical: 8,
  },

  dropdown: {
    marginTop: 8,
  },

  statusMenuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    backgroundColor: '#F9F9F9',
    marginTop: 8,
  },

  statusMenuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  /* SEGMENTED BUTTONS */
  segmentedButtons: {
    marginTop: 8,
  },

  /* INDEX INPUT */
  indexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  indexColumn: {
    flex: 1,
    marginRight: 8,
  },

  indexLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },

  indexInput: {
    height: 44,
  },

  calculateButton: {
    marginTop: 8,
  },

  /* RESULT */
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  resultColumn: {
    flex: 1,
  },

  resultLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },

  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
  },

  amountValue: {
    color: '#E53935',
  },

  /* IMAGE SECTION */
  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },

  imageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  /* NOTES INPUT */
  notesInput: {
    minHeight: 100,
    backgroundColor: '#fff',
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionIcon: {
    marginRight: 8,
  },

  imageActionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cameraButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    borderRadius: 8,
  },

  viewImageButton: {
    flex: 1,
    marginLeft: 12,
    height: 56,
    justifyContent: 'center',
    borderColor: '#1E88E5',
    borderRadius: 8,
  },

  viewImageButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* CONDITION ITEM */
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
  },

  conditionText: {
    fontSize: 13,
    color: '#666',
  },

  /* ACTION BUTTONS - TOP ROW */
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#1E88E5',
  },

  /* BOTTOM BUTTONS - BOTTOM ROW */
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    zIndex: 10,
  },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 60,
  },

  navButton: {
    flex: 1,
    backgroundColor: '#1E88E5',
    borderRadius: 0,
    justifyContent: 'center',
  },

  leftButton: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },

  rightButton: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.3)',
  },

  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 0,
    justifyContent: 'center',
  },

  saveButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  /* IMAGE PREVIEW MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  modalCloseButton: {
    margin: 0,
    padding: 0,
  },

  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
  },

  noImagePlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

  noImageText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },

  /* THREE MONTHS BUTTON */
  threeMonthsButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  threeMonthsButton: {
    borderColor: '#1E88E5',
    paddingVertical: 6,
  },

  threeMonthsButtonLabel: {
    fontSize: 12,
    color: '#1E88E5',
  },

  /* THREE MONTHS MODAL */
  monthsCard: {
    marginTop: 12,
  },

  monthRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  monthColumn: {
    flex: 1,
    alignItems: 'center',
  },

  monthLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },

  monthValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E88E5',
  },

  /* DROPDOWN MENU ITEMS */
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

  /* CUSTOM DROPDOWN */
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 250,
    minWidth: 250,
    overflow: 'hidden',
  },

  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },

  /* MENU MODAL */
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '70%',
    width: '85%',
    paddingTop: 12,
  },

  menuModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  menuModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  menuOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  menuOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  buttonContent56: {
    height: 56,
  },
});
