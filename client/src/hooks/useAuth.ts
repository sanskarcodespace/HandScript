import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { loginSchema, registerSchema } from '../lib/validators';
import { z } from 'zod';
import { AxiosError } from 'axios';

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isInitialized, setUser, clearUser } = useAuthStore();

  const handleApiError = (error: unknown): string => {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const login = async (data: LoginData) => {
    try {
      const res = await api.post('/auth/login', data);
      setUser(res.data.user, res.data.accessToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.data.user, res.data.accessToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await api.post('/auth/google', { idToken });
      setUser(res.data.user, res.data.accessToken);
      return { success: true, isNewUser: res.data.isNewUser };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout, just clear client state
    } finally {
      clearUser();
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
  };
};
