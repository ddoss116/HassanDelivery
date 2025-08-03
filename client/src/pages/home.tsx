import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/bottom-navigation";
import { OrderForm } from "@/components/order-form";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Truck, LogOut } from "lucide-react";

export default function Home() {
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

  // Get recent orders for stats
  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { whatsappNumber: string }) => {
      const response = await apiRequest("PATCH", "/api/auth/user", data);
      return response.json();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مسجل دخول",
          description: "جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const todayOrders = orders.filter((order: any) => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  });

  const completedOrders = orders.filter((order: any) => order.status === 'delivered');

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">HassanDelivery</h1>
                <p className="text-xs text-gray-500">خدمة التوصيل السريع</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {(user as any)?.profileImageUrl ? (
                  <img
                    src={(user as any).profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || 'U'}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            أهلاً {(user as any)?.firstName || 'بك'}
          </h2>
          <p className="text-gray-600">اطلب ما تحتاجه وسنوصله لك بسرعة</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-green-600 text-2xl font-bold">{todayOrders.length}</div>
              <div className="text-xs text-gray-500">طلبات اليوم</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-blue-600 text-2xl font-bold">10</div>
              <div className="text-xs text-gray-500">ريال التوصيل</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-amber-600 text-2xl font-bold">30</div>
              <div className="text-xs text-gray-500">دقيقة</div>
            </CardContent>
          </Card>
        </div>

        {/* Order Form */}
        <OrderForm
          onOrderCreated={(order) => {
            // Update user's WhatsApp number if needed
            const whatsappNumber = order.user?.whatsappNumber;
            if (whatsappNumber && !(user as any)?.whatsappNumber) {
              updateProfileMutation.mutate({ whatsappNumber });
            }
          }}
        />

        {/* Recent Orders */}
        {orders.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                طلباتك السابقة
              </h3>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {order.category === 'supermarket' ? 'سوبر ماركت' :
                         order.category === 'grocery' ? 'بقالة' :
                         order.customCategory || 'أخرى'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')} • 
                        {parseFloat(order.totalCost || '0').toFixed(0)} ريال
                      </p>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'delivered' ? 'تم التوصيل' :
                       order.status === 'confirmed' ? 'مؤكد' :
                       order.status === 'in_progress' ? 'قيد التنفيذ' :
                       'في الانتظار'}
                    </div>
                  </div>
                ))}
                {orders.length > 3 && (
                  <Button variant="outline" className="w-full" size="sm">
                    عرض جميع الطلبات
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
