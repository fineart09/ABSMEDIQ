package com.app.repository.impl;

import com.app.dto.CustomerSummaryDTO;
import com.app.repository.CustomerRepository;
import com.app.repository.CustomerRepositoryCustom;import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.util.StopWatch;

import java.util.List;import java.util.stream.Collectors;

@Slf4j
@Repository
public class CustomerRepositoryImpl implements CustomerRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<CustomerSummaryDTO> getAllCustomerSummaries() {
        // 1. Log เมื่อเริ่มฟังก์ชัน (DEBUG Level)
        log.debug("Repository: Starting getAllCustomerSummaries query");

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        String sql = null;

        try {
            sql = "SELECT HN as id, NAME_THAI as name, MIDDLENAME_ENG as middleName, " +
                    "SURNAME_THAI as lastName, CUS_STATUS as status FROM CUSTOMER";

            // ใช้ createNativeQuery และดึงผลลัพธ์เป็น Object[] มา Map เข้า DTO
            List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();

            log.info("Successfully fetched {} customer summaries. Execution time: {} ms",
                    rows.size(), stopWatch.getTotalTimeMillis());

            stopWatch.stop();

            return rows.stream().map(row -> new CustomerSummaryDTO(
                    (Integer) row[0], // id (HN)
                    (String) row[1], // name
                    (String) row[2], // middleName
                    (String) row[3], // lastName
                    (String) row[4]  // status
            )).collect(Collectors.toList());

        } catch (Exception e) {
            //error
            log.error("Database Error: Failed to fetch customer summaries. Query: [{}]", sql);
            log.error("Exception details: ", e); // ส่ง e ไปเพื่อให้พิมพ์ StackTrace ทั้งหมด
            throw e;
        }
    }
}