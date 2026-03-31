export type MailInformation = {
  to: string,
  subject: string,
  template: string,
}

export type AccountCreationContext = {
  name: string,
  username: string,
  password: string,
}

export type OtpContext = {
  name: string,
  otp: string,
}

export type DeleteAccountContext = {
  fullName: string,
  departmentName: string,
  email: string
}

export type UpdateAccountContext = {
  fullName: string,
  departmentName: string,
}

export type UpdatePasswordContext = {
  fullName: string,
}

export type NewDeviceLoginContext = {
  name: string,
  deviceName: string,
  loginTime: string,
  ipAddress: string,
}
