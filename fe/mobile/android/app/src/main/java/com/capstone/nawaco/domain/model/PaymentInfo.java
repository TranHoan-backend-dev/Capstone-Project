package com.capstone.nawaco.domain.model;

import androidx.annotation.Nullable;

public class PaymentInfo {
    private final String id;
    private final double amount;
    private final String paymentDate;
    private final boolean isPaid;
    private final String paymentMethod;
    private final String description;

    public PaymentInfo(String id, double amount, String paymentDate, boolean isPaid,
                       String paymentMethod, @Nullable String description) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.isPaid = isPaid;
        this.paymentMethod = paymentMethod;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public double getAmount() {
        return amount;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    @Nullable
    public String getDescription() {
        return description;
    }
}
