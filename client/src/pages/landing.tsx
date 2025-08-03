import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Clock, MapPin, MessageCircle } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      title: "توصيل سريع",
      description: "نوصل طلبك في أقل من 45 دقيقة",
    },
    {
      icon: <Clock className="w-12 h-12 text-green-600" />,
      title: "متاح 24/7",
      description: "خدمة متواصلة طوال أيام الأسبوع",
    },
    {
      icon: <MapPin className="w-12 h-12 text-amber-600" />,
      title: "تتبع الموقع",
      description: "تحديد دقيق للموقع بخرائط جوجل",
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-purple-600" />,
      title: "تواصل مباشر",
      description: "تأكيد الطلب عبر الواتساب",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">HassanDelivery</h1>
                <p className="text-sm text-gray-500">خدمة التوصيل السريع</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            اطلب ما تحتاجه
            <span className="block text-blue-600">وسنوصله لك بسرعة</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            خدمة توصيل احترافية مع تقدير ذكي للأسعار والأوقات باستخدام الذكاء الاصطناعي
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/api/login"}
          >
            ابدأ الآن - سجل دخولك
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            كيف يعمل التطبيق؟
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">سجل دخولك</h4>
              <p className="text-gray-600">أنشئ حسابك أو سجل دخولك بسهولة</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">اكتب طلبك</h4>
              <p className="text-gray-600">اكتب ما تحتاجه وحدد موقعك على الخريطة</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">احصل على طلبك</h4>
              <p className="text-gray-600">سنحسب التكلفة ونوصل طلبك بسرعة</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            جاهز لتجربة الخدمة؟
          </h3>
          <p className="text-gray-600 mb-6">
            انضم إلى آلاف العملاء الذين يثقون في خدمتنا
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/api/login"}
          >
            ابدأ الآن
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center ml-2">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HassanDelivery</span>
          </div>
          <p className="text-gray-400">
            خدمة التوصيل السريع - جميع الحقوق محفوظة © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
