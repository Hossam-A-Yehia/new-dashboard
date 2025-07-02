const authEndpoints = {
  login: "/auth/login",
  loginWithGoogle: "/auth/social-login",
  register: "/auth/register",
  forgetPassword: "/auth/send-forget-password-code",
  resetPassword: "/auth/reset-password",
  verify: "/auth/v1/verify-credentials",
  resendCode: "/auth/v1/send-verification-code",
  changePhoneOrEmail: "/auth/verification/update-contact-info",
};

export default authEndpoints;
