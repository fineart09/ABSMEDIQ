package com.app.dto;

public record CustomerSummaryDTO(
        String id,
        String title,
        String firstName,
        String middleName,
        String lastName,
        String status
) {}
