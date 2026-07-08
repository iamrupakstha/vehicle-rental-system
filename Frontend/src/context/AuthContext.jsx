import React, {createContext, useState, useContext, useEffect} from "react";
import { authAPI } from "../services/api";

//create context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

//auth Provider
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));


//LOAD USER ON APP START
useEffect(() => {
  const loadUser = async() => {
    if(!token) {
      setLoading(false);
      return;
    }

    try{
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch(error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  loadUser();
}, [token]);

//login user
const login = async (email, password) => {
  try{
    const response = await authAPI.login({email, password});
    const {token, user} = response.data;

    //store token and user
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);

    return{success: true, user};

  } catch(error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login Failed',
    };
  }
}

//register
const register = async(userData) => {
  try{
    const response = await authAPI.register(userData);
    const {token, user} = response.data;

    localStorage.serItem('token', token);
    setToken(token);
    setUser(user);
    return {success: true, user};
  } catch(error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};

// logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(hull);
  setUser(null);
};

//check roles
const isAuthenticated = !!user;
const isAdmin = user?.role === 'admin';

const value = {
  user, 
  loading, token, login, register, logout, isAuthenticated, isAdmin,
};

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};

export default AuthContext;