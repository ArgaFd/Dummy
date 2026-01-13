import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen relative">
      {/* SVG Background with Elegant Theme Colors */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#111827'
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 opacity-80"
        style={{ mixBlendMode: 'multiply' }}
      ></div>

      {/* Animated Background Pattern - Subtle */}
      <div className="absolute inset-0 bg-black bg-opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section - Fullscreen Auto */}
        <div className="relative overflow-hidden min-h-screen">
          <div className="relative max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-24 lg:py-32 xl:py-40">
            <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20 lg:items-center">
              {/* Left Content - Fullscreen Auto */}
              <div className="space-y-6 lg:space-y-8 xl:space-y-10">
                {/* Animated Badge */}
                <div className="inline-flex items-center px-4 py-2 text-sm lg:text-base xl:text-lg font-bold text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="w-2 h-2 lg:w-3 lg:h-3 xl:w-4 xl:h-4 bg-green-400 rounded-full mr-2 lg:mr-3 xl:mr-4 animate-pulse"></span>
                  Open for Business 24/7
                </div>

                <div className="space-y-4 lg:space-y-6 xl:space-y-8">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black text-white leading-tight">
                    <span className="block mb-2 lg:mb-4 xl:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                      Restaurant
                    </span>
                    <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white/90">
                      Digital Experience
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/80 leading-relaxed max-w-none">
                    Transform your dining experience with
                    <span className="font-bold text-yellow-400"> QR Code Ordering</span>,
                    <span className="font-bold text-green-400"> Instant Payments</span>, and
                    <span className="font-bold text-blue-400"> Smart Analytics</span>
                  </p>
                </div>

                {/* Enhanced CTA Buttons - Fullscreen Auto */}
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-8">
                  <Link
                    to="/scan"
                    className="group relative inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base sm:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-black text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center">
                      <svg className="w-5 h-5 sm:w-6 lg:w-7 xl:w-8 2xl:w-10 mr-2 sm:mr-3 lg:mr-3 xl:mr-4 2xl:mr-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Scan & Order Now</span>
                      <svg className="w-4 h-4 sm:w-5 lg:w-5 xl:w-6 2xl:w-8 ml-2 lg:ml-3 xl:ml-4 2xl:ml-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="/menu?table=1"
                    className="group relative inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 lg:py-4 xl:py-5 2xl:py-6 text-base sm:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-black text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl transition-all transform hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 overflow-hidden"
                  >
                    <div className="relative flex items-center">
                      <svg className="w-5 h-5 sm:w-6 lg:w-7 xl:w-8 2xl:w-10 mr-2 sm:mr-3 lg:mr-3 xl:mr-4 2xl:mr-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>View Menu</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Content - Desktop Visual Fullscreen Auto */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Phone Mockup - Fullscreen Auto */}
                  <div className="relative mx-auto w-64 lg:w-72 xl:w-80 2xl:w-96 h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] shadow-2xl border-6 border-gray-800 overflow-hidden">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 lg:w-36 xl:w-40 2xl:w-48 h-6 lg:h-7 xl:h-8 2xl:h-10 bg-gray-900 rounded-b-2xl"></div>

                    {/* Screen Content - Fixed */}
                    <div className="h-full bg-gradient-to-br from-orange-50 to-red-50 p-4">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-2"></div>
                        <div className="text-sm font-black text-gray-900">Restaurant App</div>
                        <div className="text-xs text-gray-600">Meja 1</div>
                      </div>

                      {/* Menu Items - Fixed */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3 shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-800 rounded w-3/4 mb-1"></div>
                              <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="text-sm font-black text-orange-600">25K</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-3 shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-800 rounded w-3/4 mb-1"></div>
                              <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="text-sm font-black text-green-600">20K</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-3 shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-800 rounded w-3/4 mb-1"></div>
                              <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="text-sm font-black text-blue-600">5K</div>
                          </div>
                        </div>
                      </div>

                      {/* Cart Button - Fixed */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">3</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements - Fixed */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute top-1/2 -right-8 w-10 h-10 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Desktop Enhanced */}
        <div className="py-16 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform">50+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Menu Items</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform">2min</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Avg Order Time</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform">100%</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Digital</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Service</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Desktop Enhanced */}
        <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Revolutionary Features
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of dining with cutting-edge technology designed for modern restaurants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">QR Magic</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Instant QR scanning at your table. No app downloads, no waiting. Just scan and order!
                  </p>
                </div>
              </div>

              <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Smart Menu</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Interactive digital menu with real-time availability, photos, and detailed descriptions.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Lightning Pay</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Multiple payment options - cash, card, e-wallet. Split bills, tips, all in seconds.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Live Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Real-time order tracking, sales insights, and customer behavior analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Section */}
        <div className="py-20 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Staff Portal
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Pilih login sesuai peran Anda: Owner untuk melihat statistik bisnis, Cashier untuk mengelola pesanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Owner Login */}
              <Link
                to="/login"
                className="group relative p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Owner Login</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Masuk sebagai Owner untuk melihat statistik penjualan, laba, dan performa restoran.
                  </p>
                  <div className="flex items-center text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors">
                    <span>Masuk sebagai Owner</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Cashier Login */}
              <Link
                to="/login"
                className="group relative p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Cashier Login</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Masuk sebagai Cashier untuk melihat riwayat pesanan, konfirmasi order, dan cetak struk.
                  </p>
                  <div className="flex items-center text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                    <span>Masuk sebagai Cashier</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>

              <div className="group relative p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Need Help?</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Get support from our technical team for any system issues or questions
                  </p>
                  <div className="flex items-center text-yellow-400 font-semibold">
                    <span>Contact Support</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                  Restaurant App
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The future of dining technology. QR ordering, smart payments, and analytics in one platform.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/scan" className="text-gray-400 hover:text-white transition-colors">QR Scanner</Link></li>
                  <li><Link to="/menu?table=1" className="text-gray-400 hover:text-white transition-colors">View Menu</Link></li>
                  <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Staff Login</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Features</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400">QR Code Ordering</li>
                  <li className="text-gray-400">Digital Menu</li>
                  <li className="text-gray-400">Smart Payments</li>
                  <li className="text-gray-400">Real-time Analytics</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>support@restaurant.app</li>
                  <li>+62 812-3456-7890</li>
                  <li>24/7 Support Available</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-gray-400">
                © 2024 Restaurant App. All rights reserved. Built with ❤️ for modern dining.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
