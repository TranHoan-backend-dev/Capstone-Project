"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authFetch } from "@/utils/authFetch";
import CustomerRegistration from "../customer-registration";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const id = params.id;
        const response = await authFetch(`/api/customer/customer/${id}`);
        const result = await response.json();
        const customerData = result.data;

        if (customerData.installationFormId && !customerData.formNumber) {
          customerData.formNumber = customerData.installationFormId;
          customerData.formCode = customerData.installationFormId;
        }
        const mappedData = {
          ...customerData,
          id: customerData.customerId,
          formNumber: customerData.installationFormId || "",
          formCode: customerData.installationFormId || "",
          type: customerData.type ? customerData.type.toUpperCase() : "",
        };
        setCustomerData(mappedData);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <CustomerRegistration
      initialData={customerData}
      onSuccess={() => {
        router.push("/customers/import");
      }}
    />
  );
}
