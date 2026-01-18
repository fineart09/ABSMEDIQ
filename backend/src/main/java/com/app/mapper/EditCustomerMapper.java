package com.app.mapper;

import com.app.domain.Customer;
import com.app.dto.EditCustomerDTO;
import com.app.repository.CustomerRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Component // ทำให้ Spring สามารถฉีด (Inject) เข้าไปใน Service ได้
public class EditCustomerMapper {

    private final CustomerRepository customerRepository;

    public EditCustomerMapper(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
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
        dto.setBirthDate(entity.getBirthDate());

        //calculate age before setAge
        dto.setAge(calculateAge(entity.getBirthDate()));

        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setRemark(entity.getRemark());

        return dto;
    }

    @Transactional(readOnly = true)
    public EditCustomerDTO getCustomer(Customer entity) {
        if (entity == null) return null;

        EditCustomerDTO dto = new EditCustomerDTO();

        // Footer
        dto.setHn(entity.getId());
        dto.setStatus(entity.getStatus());

        // Name
        dto.setTitle(entity.getTitle());
        dto.setName(entity.getName());
        dto.setSurname(entity.getLastName());
        dto.setNickname(entity.getNickName());

        // Address
        dto.setAddress(entity.getAddress());
        dto.setProvince("-");
        dto.setAmphur("-");
        dto.setTumbon("-");

        // Details & Age Calculation
        dto.setGender(entity.getGender());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setBirthDate(entity.getBirthDate());
        dto.setAge(calculateAge(entity.getBirthDate())); // เรียกใช้ Helper ใน Mapper นี้

        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setRemark(entity.getRemark());

        return dto;
    }

    // ฟังก์ชันย่อยที่เฉพาะเจาะจงกับการ Mapping
    public String calculateAge(LocalDate birthDate) {
        if (birthDate == null) return "0";
        return String.valueOf(Period.between(birthDate, LocalDate.now()).getYears());
    }

    // ในไฟล์ CustomerMapper.java
    public void updateCustomer(EditCustomerDTO dto, Customer entity) {
        if (dto == null || entity == null) return;

        //footer
        //hn ไม่มีการ set เพราะเป็น primary key (id)
        entity.setStatus(dto.getStatus());
        //name
        entity.setTitle(dto.getTitle());
        entity.setName(dto.getName());
        entity.setLastName(dto.getSurname());
        entity.setNickName(dto.getNickname());
        //address
        entity.setAddress(dto.getAddress());
        //province , tumbon , amphur ยังไม่มี set entity เพราะยังไม่มี column

        //details
        entity.setGender(dto.getGender());
        entity.setBloodGroup(dto.getBloodGroup());
        entity.setBirthDate(dto.getBirthDate());
        //age ยังไม่มีการอัพเดทเพราะไม่มี column
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setRemark(dto.getRemark());
    }
}
