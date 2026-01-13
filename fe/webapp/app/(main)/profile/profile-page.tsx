"use client";

import React from "react";

import CustomerInformation from "./components/customer-information";
import WaterIndexMetrics from "./components/water-index-metrics";
import PaymentDetails from "./components/payment-details";
import PaymentHistory from "./components/payment-history";
import Actions from "./components/actions";

const ProfilePage = () => {
  return (
    <>
      <CustomerInformation />
      <WaterIndexMetrics />
      <PaymentDetails />
      <PaymentHistory />
      <Actions />
    </>
  );
};

export default ProfilePage;
