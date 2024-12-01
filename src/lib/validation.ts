// validation.js

/**
 * Validates the state object based on the provided schema.
 *
 * @param {Object} state - The object to be validated.
 * @param {Object} schema - The validation rules for each field.
 * @returns {Object} - An object containing `valid` (boolean) and `errors` (object).
 */
interface ValidationErrors {
  [key: string]: string[];
}

function validate(state: Record<string, unknown>, schema: Record<string, { required?: boolean; pattern?: RegExp; minLength?: number; maxLength?: number; custom?: (value: unknown, state: Record<string, unknown>) => string | null }>): { valid: boolean; errors: ValidationErrors } {
    let isValid = true; // Tracks overall validation status
    const errors: ValidationErrors = {}; // Stores validation errors for each field
  
    // Iterate through each field in the schema
    for (const field in schema) {
      const rules = schema[field]; // Validation rules for the field
      const value = state[field]; // Corresponding value in the state
      const fieldErrors = []; // Stores errors for the current field
  
      // Required field check
      if (rules.required && !value) {
        fieldErrors.push(`${field} is required`);
      }
  
      // Pattern match check
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        fieldErrors.push(`${field} is invalid`);
      }
  
      // Minimum length check
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
      }
  
      // Maximum length check
      if (rules.maxLength && (typeof value === 'string' || Array.isArray(value)) && value.length > rules.maxLength) {
        fieldErrors.push(`${field} must be no more than ${rules.maxLength} characters`);
      }
  
      // Custom validation function (optional)
      if (rules.custom && typeof rules.custom === "function") {
        const customError = rules.custom(value, state);
        if (customError) {
          fieldErrors.push(customError);
        }
      }
  
      // If the field has any errors, add them to the errors object
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false; // Set overall validation to false
      }
    }
  
    return { valid: isValid, errors };
  }
  
  export { validate };
  