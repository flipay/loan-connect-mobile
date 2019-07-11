
export interface CurrentUser {
  uid: string,
  phoneNumber: string,
  firstName?: string,
  lastName?: string,
  email?: string
}

export interface EditableCurrentUser {
  firstName?: string,
  lastName?: string,
  email?: string
}