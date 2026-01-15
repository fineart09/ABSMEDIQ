package com.app.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    @Column(name = "HN", length = 50)
    private String id;

    @Column(name = "NAME_THAI", nullable = false, length = 200)
    private String name;

    @Column(name = "MIDDLENAME_ENG", nullable = false, length = 200)
    private String middleName;

    @Column(name = "SURNAME_THAI", nullable = false, length = 200)
    private String lastName;

    @Column(name = "CUS_STATUS", length = 20)
    private String status;
}