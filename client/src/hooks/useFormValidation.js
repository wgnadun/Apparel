import { useState, useCallback, useMemo, useEffect } from 'react';
import { validateForm, validateField, sanitizeInput, sanitizeReviewInput } from '../utils/validation';

export const useFormValidation = (schema, initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [originalData, setOriginalData] = useState(initialData);

  // Update form data when initialData changes
  useEffect(() => {
    console.log('useFormValidation: initialData changed', initialData);
    setFormData(initialData);
    setOriginalData(initialData);
    setErrors({});
    setTouched({});
  }, [JSON.stringify(initialData)]);

  // Validate a single field
  const validateSingleField = useCallback((fieldName, value) => {
    const result = validateField(schema, fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? null : result.error
    }));
    return result.isValid;
  }, [schema]);

  // Validate entire form
  const validateFormData = useCallback(() => {
    const result = validateForm(schema, formData);
    setErrors(result.errors || {});
    return result.isValid;
  }, [schema, formData]);

  // Handle input change with validation
  const handleInputChange = useCallback((name, value) => {
    // Use lenient sanitization for review messages to allow spaces
    const sanitizedValue = name === 'reviewMessage' ? sanitizeReviewInput(value) : sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      validateSingleField(name, sanitizedValue);
    }
  }, [touched, validateSingleField]);

  // Handle field blur (mark as touched and validate)
  const handleFieldBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateSingleField(name, formData[name]);
  }, [formData, validateSingleField]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate form
      const isValid = validateFormData();
      
      if (isValid) {
        onSubmit(formData);
      }
    };
  }, [formData, validateFormData]);

  // Check if form data has changed from original
  const hasFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  // Reset form
  const resetForm = useCallback((newData = {}) => {
    setFormData(newData);
    setOriginalData(newData);
    setErrors({});
    setTouched({});
  }, []);

  // Check if form is valid and has changes
  const isFormValid = useMemo(() => {
    // First check if form has changed
    if (!hasFormChanged) {
      console.log('Form has not changed');
      return false;
    }
    
    // Check if there are any validation errors
    const hasErrors = Object.keys(errors).length > 0 && 
                     Object.values(errors).some(error => error !== null);
    
    if (hasErrors) {
      console.log('Form has errors:', errors);
      return false;
    }
    
    // Validate the entire form against the schema
    try {
      schema.parse(formData);
      console.log('Form is valid and has changes:', formData);
      return true;
    } catch (error) {
      console.log('Schema validation failed:', error.errors);
      return false;
    }
  }, [errors, formData, schema, hasFormChanged]);

  // Get field error
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [errors, touched]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return touched[fieldName] && errors[fieldName];
  }, [errors, touched]);

  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    validateSingleField,
    validateFormData,
    isFormValid,
    hasFormChanged,
    getFieldError,
    hasFieldError,
    setFormData
  };
};
