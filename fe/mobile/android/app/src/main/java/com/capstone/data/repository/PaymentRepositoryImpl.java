package com.capstone.data.repository;

import com.capstone.data.source.remote.PaymentApi;
import com.capstone.data.source.response.WrapperApiResponse;
import com.capstone.domain.model.PaymentInfo;
import com.capstone.domain.repository.PaymentRepository;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Response;

public class PaymentRepositoryImpl implements PaymentRepository {
    private final PaymentApi api;

    public PaymentRepositoryImpl(PaymentApi api) {
        this.api = api;
    }

    @Override
    public List<PaymentInfo> getPayments() throws Exception {
        Response<WrapperApiResponse<List<PaymentInfo>>> response = api.getPayments().execute();

        if (response.isSuccessful() && response.body() != null) {
            return response.body().getData();
        }

        return new ArrayList<>();
    }
}
