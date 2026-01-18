package com.app.service.impl;

import com.app.domain.Customer;
import com.app.dto.CustomerSummaryDTO;
import com.app.dto.EditCustomerDTO;
import com.app.mapper.EditCustomerMapper;
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

    @Transactional(readOnly = true)
    public EditCustomerDTO getCustomerByHn(String hn) {
        Customer entity = customerRepository.findById(hn)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลลูกค้า HN: " + hn));

        // แปลง Entity เป็น DTO
        EditCustomerDTO dto = new EditCustomerDTO();

        //footer
        dto.setHn(entity.getId());
        dto.setStatus(entity.getStatus());
        //name
        dto.setTitle(entity.getTitle());
        dto.setName(entity.getName());
        dto.setSurname(entity.getLastName());
        dto.setNickname(entity.getNickName());
        //address
        dto.setAddress(entity.getAddress());
        dto.setProvince("-");
        dto.setAmphur("-");
        dto.setTumbon("-");
        //details
        dto.setGender(entity.getGender());
        dto.setBloodGroup(entity.getBloodGroup());

        //calculate age before setAge
        dto.setAge(editCustomerMapper.calculateAge(entity.getBirthDate()));

        dto.setBirthDate(entity.getBirthDate());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setRemark(entity.getRemark());

        return dto;
    }
}