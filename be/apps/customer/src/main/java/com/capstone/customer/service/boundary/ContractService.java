package com.capstone.customer.service.boundary;

import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ContractService {
  ContractResponse createContract(CreateRequest request);

  void deleteContract(String id);

  ContractResponse getContractById(String id);

  Page<ContractResponse> getAllContracts(Pageable pageable, ContractFilterRequest request);

  List<String> findContractIdsByFormCodeAndFormNumber(String formCode, String formNumber);

  Boolean isExist(String id);

  String getLatestContractIdByPrefix(String prefix);

  ContractResponse getByFormCode(String formCode);
}
