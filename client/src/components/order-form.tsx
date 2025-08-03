import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GoogleMaps } from "./google-maps";
import { OrderSummary } from "./order-summary";
import { apiRequest } from "@/lib/queryClient";
import { insertOrderSchema } from "@shared/schema";
import { ShoppingCart, Store, Plus } from "lucide-react";
import { z } from "zod";

const formSchema = insertOrderSchema.extend({
  whatsappNumber: z.string().min(10, "رقم الواتساب مطلوب"),
});

type FormData = z.infer<typeof formSchema>;

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface OrderFormProps {
  onOrderCreated?: (order: any) => void;
}

export function OrderForm({ onOrderCreated }: OrderFormProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      category: "supermarket",
      customCategory: "",
      whatsappNumber: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderResult(data);
      onOrderCreated?.(data.order);
      toast({
        title: "تم حساب التكلفة",
        description: "راجع ملخص الطلب أدناه",
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

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    form.setValue("location", location.address);
    form.setValue("locationLat", location.lat.toString());
    form.setValue("locationLng", location.lng.toString());
  };

  const onSubmit = (data: FormData) => {
    if (!selectedLocation) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد الموقع على الخريطة",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      ...data,
      locationLat: selectedLocation.lat.toString(),
      locationLng: selectedLocation.lng.toString(),
    });
  };

  const categoryOptions = [
    {
      value: "supermarket",
      label: "سوبر ماركت",
      description: "للمواد الغذائية والمنتجات المتنوعة",
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
    },
    {
      value: "grocery",
      label: "بقالة",
      description: "للمشتريات الأساسية والسريعة",
      icon: <Store className="w-5 h-5 text-green-600" />,
    },
    {
      value: "other",
      label: "أخرى",
      description: "حدد نوع المتجر بنفسك",
      icon: <Plus className="w-5 h-5 text-amber-600" />,
    },
  ];

  if (orderResult) {
    return (
      <OrderSummary
        order={orderResult.order}
        priceEstimate={orderResult.priceEstimate}
        timeEstimate={orderResult.timeEstimate}
        onBack={() => {
          setOrderResult(null);
          form.reset();
          setSelectedLocation(null);
        }}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          إنشاء طلب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Order Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل الطلب</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="اكتب تفاصيل طلبك هنا... مثال: كيلو تفاح، لتر حليب، خبز أبيض"
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selection */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موقع التوصيل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="حدد موقعك على الخريطة"
                      readOnly
                    />
                  </FormControl>
                  <GoogleMaps
                    onLocationSelect={handleLocationSelect}
                    initialLocation={selectedLocation || undefined}
                    className="mt-2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المتجر</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-3"
                    >
                      {categoryOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label
                            htmlFor={option.value}
                            className="flex items-center gap-3 cursor-pointer flex-1 p-4 border rounded-lg hover:border-blue-300"
                          >
                            {option.icon}
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Category Input */}
            {form.watch("category") === "other" && (
              <FormField
                control={form.control}
                name="customCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="اكتب نوع المتجر"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* WhatsApp Number */}
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الواتساب للتواصل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحساب...
                </div>
              ) : (
                "احسب التكلفة وأكمل الطلب"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
