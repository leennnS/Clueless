export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(loginInput: $input) {
      message
      token
      user {
        user_id
        username
        email
        profile_image_url
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($input: CreateUserInput!) {
    register(createUserInput: $input) {
      user {
        user_id
        username
        email
        profile_image_url
      }
      message
    }
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($input: ForgotPasswordInput!) {
    requestPasswordReset(forgotPasswordInput: $input) {
      message
      email
      resetToken
      resetCode
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $input) {
      message
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      user_id
      username
      email
      profile_image_url
    }
  }
`;
