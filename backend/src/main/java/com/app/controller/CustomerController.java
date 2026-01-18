package com.app.controller;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;
import com.app.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // หรือพอร์ตที่ React ของคุณรันอยู่
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;
    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<CustomerSummaryDTO> list() {
        return service.getAllCustomers();
    }

    @GetMapping("/{hn}")
    public ResponseEntity<EditCustomerDTO> getCustomerByHn(@PathVariable String hn) {
        EditCustomerDTO dto = service.getCustomerByHn(hn);
        log.debug("getCustomerByHn: {}", dto);
        return ResponseEntity.ok(dto);
    }
}