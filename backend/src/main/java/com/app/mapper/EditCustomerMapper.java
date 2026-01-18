package com.app.mapper;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component // ทำให้ Spring สามารถฉีด (Inject) เข้าไปใน Service ได้
public class EditCustomerMapper {

    // ฟังก์ชันย่อยที่เฉพาะเจาะจงกับการ Mapping
    public String calculateAge(LocalDate birthDate) {
        if (birthDate == null) return "0";
        return String.valueOf(Period.between(birthDate, LocalDate.now()).getYears());
    }
}
