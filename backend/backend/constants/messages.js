const SUCCESS = {};

SUCCESS.CREATE_USER = { message: 'User Created Successfully!', code: 'USR_CRT' };
SUCCESS.MAIL_SENDED = 'Successfully mail sended to user';
SUCCESS.UPDATE_USER = 'User Updated Successfully!';
SUCCESS.DELETE_TASK = 'Task Deleted Successfully!';
SUCCESS.TOKEN_GENERATED = 'Token generated';
SUCCESS.DETAILS_FETCHED = "User details Fetched";
SUCCESS.UPLOADED = "Data uploaded successfully";
SUCCESS.CREATE_FEEDBACK = { message: 'Feedback Created Successfully!', code: 'USR_CRT' };
SUCCESS.VERIFICATION = "Verification Mail Send to the client";
SUCCESS.VERIFICATION_SUCCESS = "Mail verified Sucessfully";
SUCCESS.OTP_SEND = "Password reset Otp was sent to mail";
SUCCESS.OTP_VERIFIED = "Otp verified Successfully";
SUCCESS.PASSWORD_CHANGED = "Password Changed Successfully"

const ERROR = {};

ERROR.INVALID_CREDENTIALS = 'Invalid username or password, please try again';
ERROR.PASSWORD_NOTSET = 'Password not set';
ERROR.INVALID_EMAIL = 'A valid email is not entered';
ERROR.INVALID_TOKEN = 'Invalid token';
ERROR.PROVIDE_ALL_FIELD = "Please give all the field.";
ERROR.NO_USER = "No User found";
ERROR.INVALID_LINK = "Invalid Link";
ERROR.INVALID_OTP = "Enter valid otp";

module.exports = { SUCCESS, ERROR };