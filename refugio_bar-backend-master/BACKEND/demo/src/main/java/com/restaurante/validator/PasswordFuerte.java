package com.restaurante.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordFuerteValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordFuerte {
    String message() default "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
