// Function to validate signup data
const validateSignupData = (data) => {
    const { name, email, password, phone, address } = data;
    if (!name || !email || !password || !phone || !address) {
      throw new Error('Name, email, password, phone, and address are required');
    }
  };
  
  // Function to validate signin data
  const validateSignInData = (data) => {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
  };
  
  // Function to validate update password data
  const validateUpdatePasswordData = (data) => {
    const { id, currentPassword, newPassword } = data;
    if (!id || !currentPassword || !newPassword) {
      throw new Error('Client ID, current password, and new password are required');
    }
  };
  
  // Function to validate update details data
  const validateUpdateDetailsData = (data) => {
    const { id, name, phone, address } = data;
    if (!id || !name || !phone || !address) {
      throw new Error('Client ID, name, phone, and address are required');
    }
  };
  
  module.exports = {
    validateSignupData,
    validateSignInData,
    validateUpdatePasswordData,
    validateUpdateDetailsData,
  };
  