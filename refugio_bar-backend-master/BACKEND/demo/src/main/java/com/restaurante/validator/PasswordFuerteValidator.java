package com.restaurante.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordFuerteValidator implements ConstraintValidator<PasswordFuerte, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
      
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
        
        return value.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\[\\]{};':\"|,.<>/?-]).{8,}$");
    }
}
