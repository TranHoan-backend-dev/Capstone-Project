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

export type PasswordResetContext = {
  name: string,
  otp: string,
}

export type DeleteAccount = {
  fullName: string,
  departmentName: string,
  email: string
}
