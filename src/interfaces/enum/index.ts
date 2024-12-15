enum MESSAGE_CODE {
  FAILED = -1,
  NONE = 0,
  SUCCESS = 200,
  ERROR = 2,
  EXCEPTION = 3,
  RecordNotFound = 11,
  DataNotProvide = 12,
  FunctionNotSupport = 13,
  UserLock = 15,
  TableNotExists = 16,
  DataNotFound = 10003,
  Unauthorized = 401,
}
enum FORM_STATE {
  EDIT = "edit",
  ADD = "add",
}

export { MESSAGE_CODE, FORM_STATE };
