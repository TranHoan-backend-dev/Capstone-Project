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

export type DeleteAccount = {
  fullName: string,
  departmentName: string,
  email: string
}
export type UpdateAccount = {
  fullName: string,
  departmentName: string,
}
