import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useFormValidation } from '../../hooks/useFormValidation';
import { fieldHints } from '../../utils/validation';

function ValidatedForm({
  schema,
  formControls,
  initialData = {},
  onSubmit,
  buttonText,
  isBtnDisabled = false,
  className = ""
}) {
  const {
    formData,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
    isFormValid
  } = useFormValidation(schema, initialData);

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const error = getFieldError(getControlItem.name);
    const hasError = hasFieldError(getControlItem.name);

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="space-y-1">
            <Input
              name={getControlItem.name}
              placeholder={fieldHints[getControlItem.name] || getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                handleInputChange(getControlItem.name, event.target.value)
              }
              onBlur={() => handleFieldBlur(getControlItem.name)}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
              required={getControlItem.required}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;

      case "select":
        element = (
          <div className="space-y-1">
            <Select
              onValueChange={(value) =>
                handleInputChange(getControlItem.name, value)
              }
              value={value}
            >
              <SelectTrigger className={`w-full ${hasError ? "border-red-500 focus:border-red-500" : ""}`}>
                <SelectValue placeholder={fieldHints[getControlItem.name] || getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;

      case "textarea":
        element = (
          <div className="space-y-1">
            <Textarea
              name={getControlItem.name}
              placeholder={fieldHints[getControlItem.name] || getControlItem.placeholder}
              id={getControlItem.id || getControlItem.name}
              value={value}
              onChange={(event) =>
                handleInputChange(getControlItem.name, event.target.value)
              }
              onBlur={() => handleFieldBlur(getControlItem.name)}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
              required={getControlItem.required}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div className="space-y-1">
            <Input
              name={getControlItem.name}
              placeholder={fieldHints[getControlItem.name] || getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                handleInputChange(getControlItem.name, event.target.value)
              }
              onBlur={() => handleFieldBlur(getControlItem.name)}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
              required={getControlItem.required}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-2" key={controlItem.name}>
            <Label 
              htmlFor={controlItem.name}
              className={hasFieldError(controlItem.name) ? "text-red-500" : ""}
            >
              {controlItem.label}
              {controlItem.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button 
        disabled={isBtnDisabled || !isFormValid} 
        type="submit" 
        className="mt-5 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default ValidatedForm;
