import { useState, useCallback } from "react";

export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (field, value) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const setValues = useCallback((newValues) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback(
    (field) => {
      if (!validate) return true;

      const fieldErrors = validate(values);
      const fieldError = fieldErrors[field];

      if (fieldError) {
        setError(field, fieldError);
        return false;
      } else {
        clearError(field);
        return true;
      }
    },
    [values, validate, setError, clearError],
  );

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const formErrors = validate(values);
    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      if (isSubmitting) return;

      if (!validateForm()) return;

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit, isSubmitting],
  );

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0 && !isSubmitting;

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    handleSubmit,
    reset,
    validateField,
    validateForm,
  };
}
