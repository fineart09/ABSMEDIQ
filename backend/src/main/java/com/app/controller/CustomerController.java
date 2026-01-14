package com.app.controller;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<CustomerSummaryDTO> list() {
        return service.getAllCustomers();
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Customer> get(@PathVariable String id) {
//        return service.getById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
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