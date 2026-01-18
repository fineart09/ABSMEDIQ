package com.app.controller;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;
import com.app.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // หรือพอร์ตที่ React ของคุณรันอยู่
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

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
        return ResponseEntity.ok(dto);
    }


//
//    @PostMapping
//    public Customer create(@RequestBody Customer customer) {
//        return service.create(customer);
//    }
//
//    @PutMapping("/{id}")
//    public Customer update(@PathVariable String id, @RequestBody Customer customer) {
//        return service.update(id, customer);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable String id) {
//        service.delete(id);
//        return ResponseEntity.ok().build();
//    }
}