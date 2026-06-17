package com.gym.app.DTO;

import com.gym.app.Enum.Rol;

public record MembresiaInfoResponse(Long gymId, String nombreGym, Rol rol) {}
