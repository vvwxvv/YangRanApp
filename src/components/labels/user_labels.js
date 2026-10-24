import { L, F } from "@/components/labels/managerLabels";
/**
 * User Labels Dictionary
 * Contains all user-related UI text labels in both English and Chinese
 * Organized by functional categories for better maintainability
 */

// User management field labels
export const userFieldLabels = {
  username_en: L.username.en,
  username_cn: L.username.cn,
  password_en: L.password.en,
  password_cn: L.password.cn,
  email_en: F.email.en,
  email_cn: F.email.cn,
  lastLoginAt_en: L.last_login.en,
  lastLoginAt_cn: L.last_login.cn,
  createdAt_en: F.created_at.en,
  createdAt_cn: F.created_at.cn,
};

// User role labels
export const userRoleLabels = {
  roleAdmin_en: "Administrator",
  roleAdmin_cn: "管理员",
  roleUser_en: F.user.en,
  roleUser_cn: F.user.cn,
  roleEditor_en: "Editor",
  roleEditor_cn: L.edit.cn,
};

// User validation labels
export const userValidationLabels = {
  invalidEmailMessage_en: F.please_enter_a_valid_email_address.en,
  invalidEmailMessage_cn: F.please_enter_a_valid_email_address.cn,
  usernameRequired_en: "Username is required",
  usernameRequired_cn: "用户名为必填项",
  passwordRequired_en: "Password is required",
  passwordRequired_cn: "密码为必填项",
  emailRequired_en: "Email is required",
  emailRequired_cn: "邮箱为必填项",
  invalidUsername_en: "Username must be at least 3 characters",
  invalidUsername_cn: "用户名至少需要3个字符",
  invalidPassword_en: "Password must be at least 6 characters",
  invalidPassword_cn: "密码至少需要6个字符",
};

// User action labels
export const userActionLabels = {
  login_en: "Login",
  login_cn: "登录",
  logout_en: "Logout",
  logout_cn: "登出",
  register_en: "Register",
  register_cn: "注册",
  createUser_en: "Create User",
  createUser_cn: "创建用户",
  editUser_en: "Edit User",
  editUser_cn: "编辑用户",
  deleteUser_en: "Delete User",
  deleteUser_cn: "删除用户",
  changePassword_en: "Change Password",
  changePassword_cn: "修改密码",
  resetPassword_en: "Reset Password",
  resetPassword_cn: "重置密码",
};

// User status labels
export const userStatusLabels = {
  loggedIn_en: "Logged In",
  loggedIn_cn: "已登录",
  loggedOut_en: "Logged Out",
  loggedOut_cn: "已登出",
  active_en: L.active.en,
  active_cn: "活跃",
  inactive_en: "Inactive",
  inactive_cn: "非活跃",
  suspended_en: "Suspended",
  suspended_cn: "已暂停",
};

// User entity labels
export const userEntityLabels = {
  user_en: F.user.en,
  user_cn: F.user.cn,
  users_en: "Users",
  users_cn: "用户",
  account_en: "Account",
  account_cn: "账户",
  profile_en: "Profile",
  profile_cn: "个人资料",
};

// User page labels
export const userPageLabels = {
  title_cn: "用户管理",
  title_en: "User Management",
  description_cn: "管理和组织用户信息",
  description_en: "Manage and organize user information",
  itemName_cn: "用户",
  itemName_en: "User",
  page_title_en: "User Management",
  page_title_cn: "用户管理",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  additional: {
    title: (isCn) => isCn ? "附加信息" : "Additional Info",
  },
};

// User form labels
export const userFormLabels = {
  loginForm_en: "Login Form",
  loginForm_cn: "登录表单",
  registerForm_en: "Register Form",
  registerForm_cn: "注册表单",
  profileForm_en: "Profile Form",
  profileForm_cn: "个人资料表单",
  passwordForm_en: "Password Form",
  passwordForm_cn: "密码表单",
  rememberMe_en: "Remember Me",
  rememberMe_cn: "记住我",
  forgotPassword_en: "Forgot Password?",
  forgotPassword_cn: "忘记密码？",
  confirmPassword_en: "Confirm Password",
  confirmPassword_cn: "确认密码",
  currentPassword_en: "Current Password",
  currentPassword_cn: "当前密码",
  newPassword_en: "New Password",
  newPassword_cn: "新密码",
};

// User message labels
export const userMessageLabels = {
  loginSuccess_en: "Login successful",
  loginSuccess_cn: "登录成功",
  loginFailed_en: "Login failed",
  loginFailed_cn: "登录失败",
  logoutSuccess_en: "Logout successful",
  logoutSuccess_cn: "登出成功",
  registerSuccess_en: "Registration successful",
  registerSuccess_cn: "注册成功",
  registerFailed_en: "Registration failed",
  registerFailed_cn: "注册失败",
  passwordChanged_en: "Password changed successfully",
  passwordChanged_cn: "密码修改成功",
  passwordResetSent_en: "Password reset email sent",
  passwordResetSent_cn: "密码重置邮件已发送",
  userCreated_en: "User created successfully",
  userCreated_cn: "用户创建成功",
  userUpdated_en: "User updated successfully",
  userUpdated_cn: "用户更新成功",
  userDeleted_en: "User deleted successfully",
  userDeleted_cn: "用户删除成功",
  invalidCredentials_en: "Invalid username or password",
  invalidCredentials_cn: "用户名或密码错误",
  emailAlreadyExists_en: "Email already exists",
  emailAlreadyExists_cn: "邮箱已存在",
  usernameAlreadyExists_en: "Username already exists",
  usernameAlreadyExists_cn: "用户名已存在",
};

// Field labels for components
export const fieldLabelsForComponents = {
  username: L.username,
  password: L.password,
  email: L.email,
  lastLoginAt: L.last_login,
  createdAt: L.created_at,
  };

// Combined labels object for easy access
export const userLabels = {
  ...userFieldLabels,
  ...userRoleLabels,
  ...userValidationLabels,
  ...userActionLabels,
  ...userStatusLabels,
  ...userEntityLabels,
  ...userPageLabels,
  ...userFormLabels,
  ...userMessageLabels,
  fieldLabels: fieldLabelsForComponents,
};

// Export pageLabels and fieldLabelsForComponents for config files
export const pageLabels = userPageLabels;

// Helper function to get user labels
export const getUserLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language] || fieldLabelsForComponents[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (userLabels[labelKey]) {
    return userLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (userLabels[englishKey]) {
      return userLabels[englishKey];
    }
  }
  
  return key;
};

// Default export
export default userLabels;
