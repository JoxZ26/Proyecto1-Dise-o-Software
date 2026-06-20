package com.gym.app.DTO;

import com.gym.app.Enum.Rol;

public record MiembroGymResponse(Long idUsuario, String correo, Rol rol) {}