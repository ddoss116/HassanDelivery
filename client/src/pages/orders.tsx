import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/bottom-navigation";
import { isUnauthorizedError } from "@/lib/authUtils";
import { List, Calendar, MapPin, Package } from "lucide-react";

export default function Orders() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "غير مسجل دخول",
        description: "جاري تسجيل الدخول...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
    retry: false,
  });

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'تم التوصيل';
      case 'confirmed':
        return 'مؤكد';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'في الانتظار';
    }
  };

  const getCategoryText = (category: string, customCategory?: string) => {
    switch (category) {
      case 'supermarket':
        return 'سوبر ماركت';
      case 'grocery':
        return 'بقالة';
      case 'other':
        return customCategory || 'أخرى';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <List className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">طلباتي</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد طلبات بعد
              </h3>
              <p className="text-gray-600 mb-6">
                ابدأ بإنشاء طلبك الأول
              </p>
              <Button onClick={() => window.location.href = "/"}>
                إنشاء طلب جديد
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {getCategoryText(order.category, order.customCategory)}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Order Description */}
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {order.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {order.location}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Cost and Delivery Time */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {parseFloat(order.totalCost || '0').toFixed(0)} ريال
                      </p>
                      <p className="text-xs text-gray-500">
                        شامل رسوم التوصيل
                      </p>
                    </div>
                    {order.estimatedDeliveryTime && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {order.estimatedDeliveryTime}
                        </p>
                        <p className="text-xs text-gray-500">
                          وقت التوصيل المتوقع
                        </p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Status */}
                  {order.whatsappSent && (
                    <div className="bg-green-50 p-2 rounded flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">
                        تم إرسال التفاصيل عبر الواتساب
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
