package com.app.service.impl;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;
import com.app.mapper.EditCustomerMapper;
import com.app.repository.CustomerRepository;
import com.app.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation ของ CustomerService
 * ทำหน้าที่จัดการ Business Logic และการเชื่อมต่อข้อมูล
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final EditCustomerMapper editCustomerMapper;

    // Senior Best Practice: ใช้ Constructor Injection แทน @Autowired ที่ Field
    public CustomerServiceImpl(CustomerRepository customerRepository, EditCustomerMapper editCustomerMapper) {
        this.customerRepository = customerRepository;
        this.editCustomerMapper = editCustomerMapper;
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

    @Transactional
    public EditCustomerDTO createCustomer(EditCustomerDTO dto) {

        // 1. แปลง DTO เป็น Entity ใหม่
        Customer entity = editCustomerMapper.createCustomer(dto);

        //footer (ที่ไม่มีใน create customer)
        entity.setId(null); // HN คือ Primary Key ของเรา
        entity.setStatus("Active");

        // 5. บันทึก
        Customer createdCustomer = customerRepository.save(entity);

        // 6. ส่งข้อมูลที่สมบูรณ์กลับไป (รวมถึง HN ที่เพิ่งสร้าง)
        return editCustomerMapper.getCustomer(createdCustomer);
    }

    @Override
    @Transactional
    public EditCustomerDTO updateCustomer(String hn, EditCustomerDTO dto) {
        // 1. ดึงข้อมูลเดิมมาล็อคไว้
        Customer entity = customerRepository.findById(hn)
                .orElseThrow(() -> new RuntimeException("Update failed: Customer not found"));

        // 2. ใช้ Mapper อัปเดตข้อมูลจาก DTO ลง Entity
        editCustomerMapper.updateCustomer(dto, entity);

        // 3. บันทึก (Spring Data JPA จะทำ Dirty Check และ Update ให้เองเมื่อจบ Transaction)
        Customer savedCustomer = customerRepository.save(entity);

        // 4. คืนค่า DTO ที่อัปเดตแล้วกลับไป (รวมถึงการคำนวณอายุใหม่)
        return editCustomerMapper.getCustomer(savedCustomer);
    }


}