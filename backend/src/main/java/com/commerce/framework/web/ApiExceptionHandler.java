package com.commerce.framework.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleIllegalState(IllegalStateException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, Object> handleValidationFailure(MethodArgumentNotValidException exception) {
        StringBuilder message = new StringBuilder("请求内容验证失败：");
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            message.append(String.format("[%s] %s; ", error.getField(), error.getDefaultMessage()));
        });
        return Map.of("message", message.toString());
    }

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException exception) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        String message = exception.getReason() != null ? exception.getReason() : "请求失败";
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
