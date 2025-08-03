import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertOrderSchema } from "@shared/schema";
import { estimateOrderPrice, estimateDeliveryTime } from "./services/openai";
import { sendWhatsAppNotification } from "./services/whatsapp";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { whatsappNumber } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        whatsappNumber,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Create order
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });

      // Get AI estimates
      const [priceEstimate, timeEstimate] = await Promise.all([
        estimateOrderPrice(orderData.description, orderData.category, orderData.customCategory),
        estimateDeliveryTime(orderData.location, orderData.category, orderData.description)
      ]);

      // Calculate total cost
      const deliveryFee = 10;
      const totalCost = priceEstimate.estimatedItemsCost + deliveryFee;

      // Create order
      const order = await storage.createOrder({
        ...orderData,
        estimatedItemsCost: priceEstimate.estimatedItemsCost.toString(),
        deliveryFee: deliveryFee.toString(),
        totalCost: totalCost.toString(),
        estimatedDeliveryTime: timeEstimate.estimatedTime,
      });

      res.json({
        order,
        priceEstimate,
        timeEstimate,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create order" 
      });
    }
  });

  // Confirm order and send WhatsApp
  app.post('/api/orders/:id/confirm', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderId = req.params.id;
      
      const orderWithUser = await storage.getOrder(orderId);
      
      if (!orderWithUser || orderWithUser.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send WhatsApp notification
      const customerName = `${orderWithUser.user.firstName || ''} ${orderWithUser.user.lastName || ''}`.trim() || 'عميل';
      
      const whatsappSent = await sendWhatsAppNotification({
        customerName,
        customerLocation: orderWithUser.location,
        customerWhatsApp: orderWithUser.user.whatsappNumber || 'غير محدد',
        orderDescription: orderWithUser.description,
        estimatedCost: parseFloat(orderWithUser.estimatedItemsCost || '0'),
        deliveryFee: parseFloat(orderWithUser.deliveryFee || '10'),
        totalCost: parseFloat(orderWithUser.totalCost || '10'),
        estimatedTime: orderWithUser.estimatedDeliveryTime || '30-45 دقيقة',
      });

      // Update order status
      await storage.updateOrderStatus(orderId, 'confirmed');
      if (whatsappSent) {
        await storage.markWhatsappSent(orderId);
      }

      res.json({ 
        success: true, 
        whatsappSent,
        message: whatsappSent ? 'تم إرسال الطلب بنجاح' : 'تم تأكيد الطلب ولكن فشل إرسال الواتساب'
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      res.status(500).json({ message: "Failed to confirm order" });
    }
  });

  // Get user orders
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get specific order
  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderId = req.params.id;
      
      const order = await storage.getOrder(orderId);
      
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
