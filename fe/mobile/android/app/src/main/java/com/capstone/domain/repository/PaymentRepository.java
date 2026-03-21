package com.capstone.domain.repository;

import com.capstone.domain.model.PaymentInfo;
import java.util.List;

public interface PaymentRepository {
    List<PaymentInfo> getPayments() throws Exception;
}
