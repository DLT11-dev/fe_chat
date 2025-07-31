'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Users, Shield, Zap, ArrowRight, Star, Heart, Globe, CheckCircle, Play, Sparkles } from 'lucide-react';
import HomeHeader from '@/components/HomeHeader';
import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Chat Realtime',
      description: 'Trò chuyện tức thì với công nghệ WebSocket hiện đại, không độ trễ'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Kết nối toàn cầu',
      description: 'Tìm kiếm và kết nối với bạn bè từ khắp nơi trên thế giới'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin được mã hóa end-to-end với công nghệ JWT tiên tiến'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Tốc độ siêu nhanh',
      description: 'Trải nghiệm mượt mà với Next.js và NestJS hiện đại'
    }
  ];

  const benefits = [
    'Không giới hạn tin nhắn',
    'Hỗ trợ đa nền tảng',
    'Giao diện thân thiện',
    'Bảo mật cao cấp',
    'Tốc độ nhanh chóng',
    'Miễn phí hoàn toàn'
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      role: 'Sinh viên CNTT',
      content: 'Ứng dụng chat tuyệt vời! Giao diện đẹp và dễ sử dụng. Tôi thích tính năng realtime.',
      rating: 5,
      avatar: 'A'
    },
    {
      name: 'Trần Thị Bình',
      role: 'Nhân viên Marketing',
      content: 'Tôi sử dụng ChatApp cho công việc hàng ngày. Rất tiện lợi và chuyên nghiệp.',
      rating: 5,
      avatar: 'B'
    },
    {
      name: 'Lê Văn Cường',
      role: 'Freelancer',
      content: 'Bảo mật tốt và tốc độ nhanh. Đây là lựa chọn hoàn hảo cho việc giao tiếp.',
      rating: 5,
      avatar: 'C'
    }
  ];

  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen bg-white">
        <HomeHeader />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative container mx-auto px-4 py-24 lg:py-32">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Nền tảng chat hiện đại nhất 2024
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Kết nối với{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  thế giới
                </span>
                <br />
                <span className="text-gray-700">chỉ trong giây lát</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Trải nghiệm chat realtime hiện đại với giao diện đẹp mắt và tính năng bảo mật cao. 
                Kết nối với bạn bè, gia đình và đồng nghiệp một cách dễ dàng.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={handleGetStarted}
                  className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Bắt đầu miễn phí</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 bg-white"
                >
                  <Play className="w-5 h-5" />
                  <span>Xem demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                  <div className="text-gray-600">Người dùng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">1M+</div>
                  <div className="text-gray-600">Tin nhắn</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-bounce">
            <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute top-40 right-20 animate-pulse">
            <div className="w-6 h-6 bg-purple-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce">
            <div className="w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Tính năng nổi bật
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Khám phá những tính năng tuyệt vời giúp trải nghiệm chat của bạn trở nên hoàn hảo
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Tại sao chọn ChatApp?
                </h2>
                <p className="text-xl text-gray-600">
                  Những lý do khiến ChatApp trở thành lựa chọn hàng đầu
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Người dùng nói gì
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những đánh giá chân thực từ người dùng của chúng tôi
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
              Tham gia cùng hàng nghìn người dùng đang trải nghiệm ChatApp mỗi ngày. 
              Tạo tài khoản miễn phí ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleGetStarted}
                className="group flex items-center justify-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <span>Tạo tài khoản miễn phí</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="flex items-center justify-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold">ChatApp</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Kết nối mọi người thông qua công nghệ chat hiện đại và an toàn. 
                  Trải nghiệm giao tiếp tốt nhất.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-6 text-lg">Sản phẩm</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Tính năng</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Bảo mật</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tài liệu</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-6 text-lg">Hỗ trợ</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cộng đồng</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-6 text-lg">Công ty</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Báo chí</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ChatApp. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </div>
    </RedirectIfAuthenticated>
  );
} 