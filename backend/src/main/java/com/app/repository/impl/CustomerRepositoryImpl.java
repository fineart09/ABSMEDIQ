package com.app.repository.impl;

import com.app.dto.CustomerSummaryDTO;
import com.app.repository.CustomerRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.util.StopWatch;

import java.util.List;

@Slf4j
@Repository
public class CustomerRepositoryImpl implements CustomerRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<CustomerSummaryDTO> getAllCustomerSummaries() {
        // 1. Log เมื่อเริ่มฟังก์ชัน (DEBUG Level)
        log.debug("Repository: Starting getAllCustomerSummaries query");

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        String jpql = "";

        try {
            jpql = "SELECT new com.app.dto.CustomerSummaryDto(" +
                    "c.id, c.title, c.firstName, c.middleName, c.lastName, c.status) " +
                    "FROM Customer c";

            List<CustomerSummaryDTO> results = entityManager.createQuery(jpql, CustomerSummaryDTO.class)
                    .getResultList();
            stopWatch.stop();

            //log success and query time
            log.info("Successfully fetched {} customer summaries. Execution time: {} ms",
                    results.size(), stopWatch.getTotalTimeMillis());

            return results;

        } catch (Exception e) {
            //error
            log.error("Database Error: Failed to fetch customer summaries. Query: [{}]", jpql);
            log.error("Exception details: ", e); // ส่ง e ไปเพื่อให้พิมพ์ StackTrace ทั้งหมด
            throw e;
        }
    }
}