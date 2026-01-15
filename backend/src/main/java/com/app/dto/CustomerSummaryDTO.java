package com.app.dto;

public record CustomerSummaryDTO(
        int id,
        String firstName,
        String middleName,
        String lastName,
        String status
) {}
