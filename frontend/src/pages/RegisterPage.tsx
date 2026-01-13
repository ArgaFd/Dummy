import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../services/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'cashier',
    },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      const response = await authAPI.register(data);

      if (response.data.success) {
        setSuccess('Registrasi berhasil! Silakan login untuk melanjutkan.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Registrasi gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 gradient-bg-animated"></div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-lg text-white/80">
              Daftar untuk memulai perjalanan Anda
            </p>
          </div>

          {/* Register Card */}
          <div className="glass-card p-8 animate-slide-in-up">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-100 px-4 py-3 rounded-xl animate-scale-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-100 px-4 py-3 rounded-xl animate-scale-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Nama Lengkap
                </label>
                <input
                  {...register('name', {
                    required: 'Nama harus diisi',
                    minLength: {
                      value: 2,
                      message: 'Nama minimal 2 karakter'
                    }
                  })}
                  type="text"
                  className="input-modern"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.name.message as string}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Email harus diisi',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Format email tidak valid'
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className="input-modern"
                  placeholder="nama@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.email.message as string}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password harus diisi',
                    minLength: {
                      value: 6,
                      message: 'Password minimal 6 karakter'
                    }
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="input-modern"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.password.message as string}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Konfirmasi Password
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Konfirmasi password harus diisi',
                    validate: value => value === password || 'Password tidak cocok'
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="input-modern"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.confirmPassword.message as string}</p>
                )}
              </div>

              {/* Role Select */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-white mb-2">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="input-modern"
                >
                  <option value="owner">Owner</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-modern btn-gradient-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-modern h-5 w-5 mr-3 border-white/30 border-t-white"></div>
                      Mendaftar...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Daftar Sekarang</span>
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/80">
                Sudah punya akun?{' '}
                <Link
                  to="/login"
                  className="font-bold text-pink-300 hover:text-pink-200 transition-colors duration-200"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-white/60">
              © 2024 Restaurant App. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;

