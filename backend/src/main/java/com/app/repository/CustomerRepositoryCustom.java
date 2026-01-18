package com.app.repository;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;

import java.util.List;

public interface CustomerRepositoryCustom {
    public List<CustomerSummaryDTO> getAllCustomerSummaries();
}