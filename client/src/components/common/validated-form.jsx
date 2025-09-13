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
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
    isFormValid,
    resetForm
  } = useFormValidation(schema, initialData);

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const error = getFieldError(getControlItem.name);
    const hasError = hasFieldError(getControlItem.name);
    const hasValue = value && value.length > 0;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="space-y-2">
            <div className="relative">
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
                className={`transition-all duration-200 ${
                  hasError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : hasValue 
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" 
                      : "border-gray-300 focus:border-black focus:ring-black/20"
                } rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md focus:shadow-lg`}
                required={getControlItem.required}
              />
              {hasValue && !hasError && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );
        break;

      case "select":
        element = (
          <div className="space-y-2">
            <div className="relative">
              <Select
                onValueChange={(value) =>
                  handleInputChange(getControlItem.name, value)
                }
                value={value}
              >
                <SelectTrigger className={`w-full transition-all duration-200 ${
                  hasError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : hasValue 
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" 
                      : "border-gray-300 focus:border-black focus:ring-black/20"
                } rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md focus:shadow-lg`}>
                  <SelectValue placeholder={fieldHints[getControlItem.name] || getControlItem.label} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 shadow-xl">
                  {getControlItem.options && getControlItem.options.length > 0
                    ? getControlItem.options.map((optionItem) => (
                        <SelectItem 
                          key={optionItem.id} 
                          value={optionItem.id}
                          className="rounded-lg mx-1 my-1 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {optionItem.label}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
              {hasValue && !hasError && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );
        break;

      case "textarea":
        element = (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                name={getControlItem.name}
                placeholder={fieldHints[getControlItem.name] || getControlItem.placeholder}
                id={getControlItem.id || getControlItem.name}
                value={value}
                onChange={(event) =>
                  handleInputChange(getControlItem.name, event.target.value)
                }
                onBlur={() => handleFieldBlur(getControlItem.name)}
                className={`transition-all duration-200 resize-none overflow-hidden ${
                  hasError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : hasValue 
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" 
                      : "border-gray-300 focus:border-black focus:ring-black/20"
                } rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md focus:shadow-lg min-h-[100px]`}
                required={getControlItem.required}
              />
              {hasValue && !hasError && (
                <CheckCircle2 className="absolute right-3 top-3 w-5 h-5 text-green-500" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div className="space-y-2">
            <div className="relative">
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
                className={`transition-all duration-200 ${
                  hasError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : hasValue 
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" 
                      : "border-gray-300 focus:border-black focus:ring-black/20"
                } rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md focus:shadow-lg`}
                required={getControlItem.required}
              />
              {hasValue && !hasError && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        {formControls.map((controlItem) => (
          <div className="space-y-2" key={controlItem.name}>
            <Label 
              htmlFor={controlItem.name}
              className={`text-sm font-semibold text-gray-900 flex items-center gap-2 ${
                hasFieldError(controlItem.name) ? "text-red-600" : ""
              }`}
            >
              {controlItem.label}
              {controlItem.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-gray-200">
        <Button 
          disabled={isBtnDisabled || !isFormValid} 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          {buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default ValidatedForm;
