import { useState, useCallback } from "react";

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface UseAuthFormReturn {
  fields: Record<string, FormField>;
  errors: Record<string, string | null>;
  isValid: boolean;
  setFieldValue: (field: string, value: string) => void;
  setFieldError: (field: string, error: string | null) => void;
  validateField: (field: string) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldProps: (field: string) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error: string | null;
    touched: boolean;
  };
}

export const useAuthForm = (
  initialFields: Record<string, string>,
  validationRules: Record<string, ValidationRules>
): UseAuthFormReturn => {
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initial: Record<string, FormField> = {};
    Object.keys(initialFields).forEach(key => {
      initial[key] = {
        value: initialFields[key],
        error: null,
        touched: false
      };
    });
    return initial;
  });

  const setFieldValue = useCallback((field: string, value: string) => {
    setFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        error: null // Clear error when typing
      }
    }));
  }, []);

  const setFieldError = useCallback((field: string, error: string | null) => {
    setFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error
      }
    }));
  }, []);

  const validateField = useCallback((field: string): boolean => {
    const fieldData = fields[field];
    const rules = validationRules[field];
    
    if (!rules) return true;

    let error: string | null = null;

    // Required validation
    if (rules.required && !fieldData.value.trim()) {
      error = "Este campo é obrigatório";
    }
    // Min length validation
    else if (rules.minLength && fieldData.value.length < rules.minLength) {
      error = `Mínimo de ${rules.minLength} caracteres`;
    }
    // Max length validation
    else if (rules.maxLength && fieldData.value.length > rules.maxLength) {
      error = `Máximo de ${rules.maxLength} caracteres`;
    }
    // Pattern validation
    else if (rules.pattern && !rules.pattern.test(fieldData.value)) {
      error = "Formato inválido";
    }
    // Custom validation
    else if (rules.custom) {
      error = rules.custom(fieldData.value);
    }

    setFieldError(field, error);
    return !error;
  }, [fields, validationRules, setFieldError]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    Object.keys(fields).forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }, [fields, validateField]);

  const resetForm = useCallback(() => {
    setFields(prev => {
      const reset: Record<string, FormField> = {};
      Object.keys(prev).forEach(key => {
        reset[key] = {
          value: "",
          error: null,
          touched: false
        };
      });
      return reset;
    });
  }, []);

  const getFieldProps = useCallback((field: string) => ({
    value: fields[field].value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(field, e.target.value);
    },
    onBlur: () => {
      setFields(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          touched: true
        }
      }));
      validateField(field);
    },
    error: fields[field].error,
    touched: fields[field].touched
  }), [fields, setFieldValue, validateField]);

  const errors = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key].error;
    return acc;
  }, {} as Record<string, string | null>);

  const isValid = Object.values(errors).every(error => !error) && 
                  Object.values(fields).every(field => field.value.trim() !== "");

  return {
    fields,
    errors,
    isValid,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm,
    resetForm,
    getFieldProps
  };
};
