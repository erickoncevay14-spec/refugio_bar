package com.restaurante.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NombreValidator implements ConstraintValidator<NombreValido, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$");
    }
}
