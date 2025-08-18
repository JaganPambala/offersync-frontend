export const setUserData = (userData) => {
  // Store in localStorage for persistence
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Return the formatted user object for Redux
  return {
    id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    // Add any other relevant user data
  };
};

export const getUserFromStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const clearUserData = () => {
  localStorage.removeItem('user');
};
