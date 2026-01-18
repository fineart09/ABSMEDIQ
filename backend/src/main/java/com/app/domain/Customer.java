package com.app.domain;

import jakarta.persistence.*;

import java.time.LocalDate;

// แนะนำให้ใช้ Lombok (ถ้าเพิ่มใน pom.xml แล้ว)
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER", schema = "dbo")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HN", length = 200)
    private String id;

    @Column(name = "TITLE_THAI",  length = 200)
    private String title;

    @Column(name = "NAME_THAI",  length = 200)
    private String name;

    @Column(name = "MIDDLENAME_ENG",  length = 200)
    private String middleName;

    @Column(name = "SURNAME_THAI",  length = 200)
    private String lastName;

    @Column(name = "NICKNAME_ETC",  length = 200)
    private String nickName;

    @Column(name = "CUS_STATUS", length = 200)
    private String status;

    @Column(name = "ADDERSS", length = 200)
    private String address;

//    private String province;
//    private String amphur;
//    private String tumbon;

    @Column(name = "GENDER", length = 200)
    private String gender;

    @Column(name = "BLOOD_G", length = 200)
    private String bloodGroup;

//    private String age;

    @Column(name = "DOB", length = 200)
    private LocalDate birthDate;

    @Column(name = "PHONE", length = 200)
    private String phone;

    @Column(name = "MAIL", length = 200)
    private String email;

    @Column(name = "REMARK1", length = 200)
    private String remark;
}