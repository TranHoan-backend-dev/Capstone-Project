package com.capstone.nawaco.domain.repository;

import com.capstone.nawaco.domain.model.PaymentInfo;

import java.util.List;

public interface PaymentRepository {
    List<PaymentInfo> getPayments() throws Exception;
}
