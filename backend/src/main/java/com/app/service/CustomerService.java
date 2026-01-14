package com.app.service;

import com.app.domain.Customer;
import com.app.domain.CustomerSummary;
import com.app.dto.CustomerSummaryDTO;
import com.app.repository.CustomerRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CustomerService {
    List<CustomerSummaryDTO> getAllCustomers();
}
