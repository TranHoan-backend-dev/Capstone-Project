package com.capstone.data.source.remote;

import com.capstone.data.source.response.WrapperApiResponse;
import com.capstone.domain.model.PaymentInfo;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface PaymentApi {
    @GET("/device/api/v1/water-meters/usage/payments")
    Call<WrapperApiResponse<List<PaymentInfo>>> getPayments();
}
