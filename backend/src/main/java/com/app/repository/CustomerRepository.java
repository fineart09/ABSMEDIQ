package com.app.repository;

import com.app.dto.CustomerSummaryDTO;

import java.util.List;

public interface CustomerRepository {
    public List<CustomerSummaryDTO> getAllCustomerSummaries();
}
