import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Receipt, Clock, MessageCircle, ArrowLeft } from "lucide-react";

interface OrderSummaryProps {
  order: any;
  priceEstimate: any;
  timeEstimate: any;
  onBack?: () => void;
}

export function OrderSummary({ order, priceEstimate, timeEstimate, onBack }: OrderSummaryProps) {
  const { toast } = useToast();

  const confirmOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/orders/${order.id}/confirm`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم تأكيد الطلب",
        description: data.whatsappSent 
          ? "تم إرسال تفاصيل الطلب عبر الواتساب"
          : "تم تأكيد الطلب، سيتم التواصل معك قريباً",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConfirmOrder = () => {
    confirmOrderMutation.mutate();
  };

  const formatCurrency = (amount: string | number) => {
    return `${parseFloat(amount.toString()).toFixed(0)} ريال`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          العودة للتعديل
        </Button>
      )}

      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Receipt className="w-6 h-6" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Details */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">تفاصيل الطلب:</h4>
              <p className="text-gray-600 mt-1">{order.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">الموقع:</h4>
              <p className="text-gray-600 mt-1">{order.location}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">نوع المتجر:</h4>
              <Badge variant="secondary" className="mt-1">
                {order.category === 'supermarket' ? 'سوبر ماركت' :
                 order.category === 'grocery' ? 'بقالة' :
                 order.customCategory || 'أخرى'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">تكلفة المشتريات (تقدير ذكي)</span>
              <span className="font-medium">{formatCurrency(order.estimatedItemsCost)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">رسوم التوصيل</span>
              <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>المجموع المتوقع</span>
              <span className="text-blue-600">{formatCurrency(order.totalCost)}</span>
            </div>
          </div>

          {/* Confidence Indicator */}
          {priceEstimate.confidence && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                دقة التقدير: {Math.round(priceEstimate.confidence * 100)}%
              </p>
            </div>
          )}

          {/* Delivery Time */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">وقت التوصيل المتوقع</p>
                <p className="text-blue-700">{order.estimatedDeliveryTime}</p>
                {timeEstimate.confidence && (
                  <p className="text-sm text-blue-600 mt-1">
                    دقة التقدير: {Math.round(timeEstimate.confidence * 100)}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          {priceEstimate.breakdown && priceEstimate.breakdown.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">تفصيل التكلفة:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {priceEstimate.breakdown.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmOrder}
            disabled={confirmOrderMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {confirmOrderMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الإرسال...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                تأكيد الطلب وإرسال واتساب
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
