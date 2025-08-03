import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface PriceEstimate {
  estimatedItemsCost: number;
  confidence: number;
  breakdown: string[];
}

export interface DeliveryTimeEstimate {
  estimatedTime: string;
  confidence: number;
  factors: string[];
}

export async function estimateOrderPrice(
  orderDescription: string,
  category: string,
  customCategory?: string
): Promise<PriceEstimate> {
  try {
    const categoryText = category === 'other' ? customCategory : category;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert price estimator for Saudi Arabian retail markets. Analyze the order description and provide a realistic price estimate in Saudi Riyals (SAR). Consider current market prices in Saudi Arabia for the specified category. Respond with JSON in this format: { "estimatedItemsCost": number, "confidence": number, "breakdown": ["item1: X SAR", "item2: Y SAR"] }`
        },
        {
          role: "user",
          content: `Category: ${categoryText}\nOrder: ${orderDescription}\n\nEstimate the total cost of these items in Saudi Riyals (SAR).`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      estimatedItemsCost: Math.max(5, Math.round(result.estimatedItemsCost || 20)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      breakdown: result.breakdown || [],
    };
  } catch (error) {
    console.error("OpenAI price estimation error:", error);
    // Fallback estimation
    return {
      estimatedItemsCost: 25,
      confidence: 0.5,
      breakdown: ["تقدير تقريبي للطلب"],
    };
  }
}

export async function estimateDeliveryTime(
  location: string,
  category: string,
  orderDescription: string
): Promise<DeliveryTimeEstimate> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert delivery time estimator for Saudi Arabian cities. Consider traffic patterns, store availability, and order complexity. Respond with JSON in this format: { "estimatedTime": "30-45 دقيقة", "confidence": number, "factors": ["factor1", "factor2"] }`
        },
        {
          role: "user",
          content: `Location: ${location}\nCategory: ${category}\nOrder: ${orderDescription}\n\nEstimate delivery time in Arabic.`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      estimatedTime: result.estimatedTime || "30-45 دقيقة",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8)),
      factors: result.factors || ["حركة المرور", "توفر المنتجات"],
    };
  } catch (error) {
    console.error("OpenAI delivery time estimation error:", error);
    // Fallback estimation
    return {
      estimatedTime: "30-45 دقيقة",
      confidence: 0.7,
      factors: ["تقدير معياري"],
    };
  }
}
