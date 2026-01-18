package com.app.dto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EditCustomerDTO {
    //footer
    private String hn;
    private String status;
    //name
    private String title;
    private String name;
    private String surname;
    private String nickname;
    //address
    private String address;
    private String province;
    private String amphur;
    private String tumbon;
    //details
    private String gender;
    private String bloodGroup;
    private String age;
    private LocalDate birthDate;
    private String phone;
    private String email;
    private String remark;
}
