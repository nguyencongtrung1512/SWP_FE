export const loginMessage: Record<string, string> = {
  'Invalid login information or account is inactive.':
    'Thông tin đăng nhập không hợp lệ hoặc tài khoản chưa được kích hoạt.',
  'Account is not permitted to login due to invalid role.':
    'Tài khoản không được phép đăng nhập do vai trò không hợp lệ.',
  'Login successful.': 'Đăng nhập thành công!',
  'Tài khoản của bạn đã bị khóa, nếu bạn nghĩ đây là một sự hiểu lầm, hãy gửi yêu cầu mở khóa cho chúng tôi.':
    'Tài khoản của bạn đã bị khóa, nếu bạn nghĩ đây là một sự hiểu lầm, hãy gửi yêu cầu mở khóa cho chúng tôi.'
}

export const otpMessage: Record<string, string> = {
  'Account not found.': 'Không tìm thấy tài khoản.',
  'Account is already active.': 'Tài khoản đã được kích hoạt trước đó.',
  'Invalid or expired OTP.': 'OTP không hợp lệ hoặc đã hết hạn.',
  'Your OTP is still active. Please use the existing OTP.':
    'OTP của bạn vẫn còn hiệu lực. Vui lòng sử dụng OTP hiện tại.',
  'Account verified successfully.': 'Xác minh tài khoản thành công.',
  'Failed to generate OTP.': 'Không thể tạo mã OTP.',
  'Failed to resend OTP email.': 'Gửi email chứa OTP thất bại.',
  'A new OTP has been sent to your email.': 'Một mã OTP mới đã được gửi đến email của bạn.'
}

export const registerMessage: Record<string, string> = {
  'Password and Confirm Password do not match.': 'Mật khẩu và mật khẩu xác nhận không khớp.',
  'Username or Email already exists.': 'Tên người dùng hoặc email đã tồn tại.',
  'Failed to generate OTP.': 'Không thể tạo mã OTP.',
  'Failed to send OTP email.': 'Gửi email chứa OTP thất bại.',
  'Registration successful. An OTP has been sent to your email. Please verify to activate your account.':
    'Đăng ký thành công. Một mã OTP đã được gửi đến email của bạn. Vui lòng xác minh để kích hoạt tài khoản.',
  'Failed to create nurse account.': 'Không thể tạo tài khoản y tá.',
  'Nurse account created successfully.': 'Tạo tài khoản y tá thành công!',
  'Email already exists.': 'Email đã tồn tại.'
}

export const resetPasswordMessage: Record<string, string> = {
  'Invalid request.': 'Yêu cầu không hợp lệ.',
  'Invalid or expired token.': 'Mã xác thực không hợp lệ hoặc đã hết hạn.',
  'Password reset successfully.': 'Đặt lại mật khẩu thành công!'
}

export const forgotPasswordMessage: Record<string, string> = {
  'If an account with that email exists, you will receive a password reset email.':
    'Nếu tài khoản với email đó tồn tại, bạn sẽ nhận được email đặt lại mật khẩu.'
}

export const accountMessage: Record<string, string> = {
  'Account not found.': 'Không tìm thấy tài khoản.',
  'Email already exists.': 'Email đã tồn tại.',
  'A problem occurred while processing your request.': 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.',
  'Account updated successfully.': 'Cập nhật thông tin tài khoản thành công.',
  'Current password is incorrect.': 'Mật khẩu hiện tại chưa chính xác.',
  'New password cannot be the same as the current password.': 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
  'Password successfully changed.': 'Đổi mật khẩu thành công.'
}

export const parentMessage: Record<string, string> = {
  'Student code is required.': 'Bắt buộc phải có mã học sinh.',
  'Invalid account information.': 'Thông tin tài khoản không hợp lệ.',
  'Student not found.': 'Không tìm thấy học sinh.',
  'This student is already linked to a parent.': 'Học sinh này đã được liên kết với một phụ huynh khác.',
  'Student successfully linked to parent.': 'Liên kết học sinh với phụ huynh thành công.'
}

export const healthRecordMessage: Record<string, string> = {
  'Parent does not exist.': 'Không tìm thấy thông tin phụ huynh.',
  'Student does not exist.': 'Không tìm thấy thông tin học sinh.',
  'Student is not a child of this parent.': 'Học sinh không phải là con của phụ huynh này.',
  'Health record created successfully.': 'Tạo hồ sơ sức khỏe thành công.'
}

export const sendMedicineMessage: Record<string, string> = {
  'You are not the parent of this student.': 'Bạn không phải là phụ huynh của học sinh này.',
  'Failed to send medication request.': 'Gửi yêu cầu gửi thuốc không thành công.',
  'Medication request sent successfully.': 'Yêu cầu gửi thuốc thành công!'
}

type MessageSource =
  | 'login'
  | 'otp'
  | 'register'
  | 'resetPassword'
  | 'forgotPassword'
  | 'healthRecord'
  | 'account'
  | 'parent'
  | 'sendMedicine'

export function translateMessage(message: string, source: MessageSource): string {
  const dictionaries: Record<MessageSource, Record<string, string>> = {
    login: loginMessage,
    otp: otpMessage,
    register: registerMessage,
    resetPassword: resetPasswordMessage,
    forgotPassword: forgotPasswordMessage,
    healthRecord: healthRecordMessage,
    account: accountMessage,
    parent: parentMessage,
    sendMedicine: sendMedicineMessage
  }

  return dictionaries[source][message] || message
}
