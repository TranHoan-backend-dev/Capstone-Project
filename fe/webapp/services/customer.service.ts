// services/customer.ts
import { CreateCustomerPayload, CustomerResponse } from "@/types";
import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const viewAllCustomers = async (
  accessToken: string,
): Promise<CustomerResponse> => {
  const response = await axios.get(`${API_GATEWAY_URL}/customer/customer`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// services/customer.service.ts - Cập nhật để log chi tiết
export const createCustomer = async (  accessToken: string, payload: CreateCustomerPayload) => {
  try {
    console.log("=== SENDING TO GATEWAY ===");
    console.log("URL:", `${API_GATEWAY_URL}/customer/customers`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${API_GATEWAY_URL}/customer/customers`,
      payload,
      {
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Token trong HEADER
        }
      }
    );
    
    console.log("=== GATEWAY RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error: any) {
    console.error("=== GATEWAY ERROR ===");
    
    if (error.response) {
      // Lỗi từ gateway (4xx, 5xx)
      console.error("Status:", error.response.status);
      console.error("Status Text:", error.response.statusText);
      console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      
      // Log chi tiết validation errors nếu có
      if (error.response.data?.errors) {
        console.error("Validation Errors:", error.response.data.errors);
      }
      if (error.response.data?.message) {
        console.error("Message:", error.response.data.message);
      }
      if (error.response.data?.details) {
        console.error("Details:", error.response.data.details);
      }
      
    } else if (error.request) {
      // Không nhận được response
      console.error("No response received:", error.request);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
    } else {
      // Lỗi khi setup request
      console.error("Request setup error:", error.message);
    }
    
    throw error;
  }
};
