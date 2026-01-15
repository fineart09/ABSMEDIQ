package com.app.repository;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String>, CustomerRepositoryCustom {
}