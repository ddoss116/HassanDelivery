import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MessageCircle, Phone, Clock, Headphones } from "lucide-react";

export default function Support() {
  const handleWhatsAppContact = () => {
    window.open("https://wa.me/966557808626", "_blank");
  };

  const handlePhoneCall = () => {
    window.open("tel:+966557808626", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Headphones className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">الدعم الفني</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Message */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              نحن هنا لمساعدتك
            </h2>
            <p className="text-gray-600">
              فريق الدعم الفني متاح لمساعدتك في أي وقت
            </p>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="space-y-4">
          {/* WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-600">
                <MessageCircle className="w-6 h-6" />
                واتساب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                تواصل معنا عبر الواتساب للحصول على رد سريع
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">0557808626</p>
                  <p className="text-sm text-gray-500">الطريقة المفضلة للتواصل</p>
                </div>
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700"
                >
                  إرسال رسالة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phone Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-600">
                <Phone className="w-6 h-6" />
                اتصال هاتفي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                اتصل بنا مباشرة للحالات العاجلة
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">0557808626</p>
                  <p className="text-sm text-gray-500">للطوارئ والاستفسارات العاجلة</p>
                </div>
                <Button 
                  onClick={handlePhoneCall}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  اتصال
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-600">
              <Clock className="w-6 h-6" />
              ساعات العمل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">السبت - الخميس</span>
                <span className="text-gray-600">8:00 ص - 12:00 ص</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">الجمعة</span>
                <span className="text-gray-600">2:00 م - 12:00 ص</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg mt-4">
                <p className="text-sm text-green-800 text-center">
                  ✅ الخدمة متاحة الآن - نحن مستعدون لمساعدتك
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">كم تستغرق عملية التوصيل؟</h4>
                <p className="text-sm text-gray-600">عادة ما تستغرق من 30-45 دقيقة حسب الموقع والطلب</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">هل يمكنني تتبع طلبي؟</h4>
                <p className="text-sm text-gray-600">نعم، يمكنك متابعة حالة الطلب من صفحة "طلباتي"</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">ما هي رسوم التوصيل؟</h4>
                <p className="text-sm text-gray-600">رسوم التوصيل ثابتة 10 ريال لجميع الطلبات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}