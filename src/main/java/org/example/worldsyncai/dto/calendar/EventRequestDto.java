package org.example.worldsyncai.dto.calendar;

public record EventRequestDto(String summary, String description, DateTimeDto start, DateTimeDto end) {
}
