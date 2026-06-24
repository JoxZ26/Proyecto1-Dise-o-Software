package com.gym.app.Exception;

// 403 Forbidden — usuario autenticado pero sin el rol requerido en ese gym
public class AccesoProhibidoException extends RuntimeException {
    public AccesoProhibidoException(String message) {
        super(message);
    }
}
