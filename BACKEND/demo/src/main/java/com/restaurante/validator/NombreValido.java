package com.restaurante.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NombreValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NombreValido {
    String message() default "El nombre solo debe contener letras";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
