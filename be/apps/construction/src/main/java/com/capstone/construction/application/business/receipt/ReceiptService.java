package com.capstone.construction.application.business.receipt;

import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;

public interface ReceiptService {
  ReceiptResponse createReceipt(CreateRequest request);

  ReceiptResponse updateReceipt(UpdateRequest request);

  void deleteReceipt(String formCode, String formNumber);

  ReceiptResponse getReceipt(String formCode, String formNumber);
}
