import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
  },

  /* ================= HEADER / PROGRESS ================= */
  progressContainer: {
    marginBottom: 40,
  },

  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E8F5',
    borderRadius: 2,
  },

  progressSegmentActive: {
    backgroundColor: '#5B7FFF',
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#5B7FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D2E',
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    color: '#8B92A8',
    lineHeight: 22,
    marginBottom: 32,
  },

  /* ================= INPUT ================= */
  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },

  /* ================= BUTTON ================= */
  button: {
    marginTop: 12,
    borderRadius: 12,
  },

  buttonContent: {
    paddingVertical: 6,
  },

  /* ================= OTP ================= */
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },

  otpInput: {
    flex: 1,
    height: 56,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },

  otpHelper: {
    fontSize: 13,
    color: '#B0B7C8',
    textAlign: 'center',
    marginBottom: 12,
  },

  resendText: {
    fontSize: 14,
    color: '#B0B7C8',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },

  resendTextActive: {
    color: '#5B7FFF',
  },

  /* ================= PASSWORD REQUIREMENTS ================= */
  requirementsBox: {
    backgroundColor: '#F6F8FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E8F5',
  },

  requirementsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D2E',
    marginBottom: 16,
  },

  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },

  bulletActive: {
    backgroundColor: '#FFA726',
  },

  bulletInactive: {
    backgroundColor: '#D1D5DB',
  },

  requirementText: {
    fontSize: 14,
    color: '#8B92A8',
    flex: 1,
  },

  requirementTextActive: {
    color: '#1A1D2E',
    fontWeight: '500',
  },

  recommended: {
    fontStyle: 'italic',
    color: '#B0B7C8',
  },

  /* ================= FOOTER ================= */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  footerText: {
    fontSize: 14,
    color: '#8B92A8',
  },

  link: {
    fontSize: 14,
    color: '#5B7FFF',
    fontWeight: '700',
  },
});

export default styles;
