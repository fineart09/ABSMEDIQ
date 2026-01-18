package com.app.controller;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;
import com.app.mapper.EditCustomerMapper;
import com.app.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // หรือพอร์ตที่ React ของคุณรันอยู่
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;
    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final EditCustomerMapper editCustomerMapper;

    public CustomerController(CustomerService service, EditCustomerMapper editCustomerMapper) {
        this.service = service;
        this.editCustomerMapper = editCustomerMapper;
    }

    @GetMapping
    public List<CustomerSummaryDTO> list() {
        return service.getAllCustomers();
    }

    @GetMapping("/{hn}")
    public ResponseEntity<EditCustomerDTO> getCustomerByHn(@PathVariable String hn) {
        EditCustomerDTO dto = editCustomerMapper.getCustomerByHn(hn);
        log.debug("getCustomerByHn: {}", dto);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<EditCustomerDTO> create(@RequestBody EditCustomerDTO dto) {
        log.info("Creating new customer: {} {}", dto.getName(), dto.getSurname());
        EditCustomerDTO created = service.createCustomer(dto);

        // คืนค่าพร้อม URI ของทรัพยากรใหม่ (Best Practice)
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{hn}")
    public ResponseEntity<EditCustomerDTO> update(@PathVariable String hn, @RequestBody EditCustomerDTO dto) {
        log.info("Updating customer HN: {}", hn);
        EditCustomerDTO result = service.updateCustomer(hn, dto);
        return ResponseEntity.ok(result);
    }
}