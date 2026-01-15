package com.app.dto;

public record CustomerSummaryDTO(
        int id,
        String name,
        String phone,
        String status
) {}
