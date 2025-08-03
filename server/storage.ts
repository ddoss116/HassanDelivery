import {
  users,
  orders,
  type User,
  type UpsertUser,
  type Order,
  type InsertOrder,
  type OrderWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<OrderWithUser | undefined>;
  getUserOrders(userId: string): Promise<OrderWithUser[]>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  markWhatsappSent(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async getOrder(id: string): Promise<OrderWithUser | undefined> {
    const [result] = await db
      .select()
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.orders,
      user: result.users,
    };
  }

  async getUserOrders(userId: string): Promise<OrderWithUser[]> {
    const results = await db
      .select()
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
    
    return results.map(result => ({
      ...result.orders,
      user: result.users,
    }));
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id));
  }

  async markWhatsappSent(id: string): Promise<void> {
    await db
      .update(orders)
      .set({ whatsappSent: true, updatedAt: new Date() })
      .where(eq(orders.id, id));
  }
}

export const storage = new DatabaseStorage();
