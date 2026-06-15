package com.gym.app.DTO;

public record LoginRequest(
        String correo,
        String password
) {
}