package com.app.service.impl;

import com.app.dto.CustomerSummaryDTO;
import com.app.repository.CustomerRepository;
import com.app.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Implementation ของ CustomerService
 * ทำหน้าที่จัดการ Business Logic และการเชื่อมต่อข้อมูล
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    // Senior Best Practice: ใช้ Constructor Injection แทน @Autowired ที่ Field
    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * ดึงข้อมูลรายชื่อลูกค้าทั้งหมด
     * @return รายชื่อลูกค้าในรูปแบบ DTO (HN, Title, Names, Status)
     */
    @Override
    @Transactional(readOnly = true) // ช่วย Optimize ประสิทธิภาพสำหรับ SQL Server ในการอ่านข้อมูล
    public List<CustomerSummaryDTO> getAllCustomers() {
        try {
            // เรียกฟังก์ชันที่เราเตรียมไว้ใน Repository
            return customerRepository.getAllCustomerSummaries();
        } catch (Exception e) {
            // ในระบบ Enterprise ควรใช้ Logger (เช่น SLF4J) บันทึก Error
            throw new RuntimeException("เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า: " + e.getMessage());
        }
    }
}