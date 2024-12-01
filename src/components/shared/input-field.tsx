'use client';

import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
  id?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  className = "",
  error = "",
  name,
  disabled = false,
  id,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);

  const handleFocus = () => {
    if (labelRef.current) {
      labelRef.current.classList.add("text-primary");
    }
  };

  const handleBlur = () => {
    if (labelRef.current) {
      labelRef.current.classList.remove("text-primary");
    }
  };

  return (
    <div className={className}>
      <Label
        ref={labelRef}
        htmlFor={id}
        className={`text-sm font-normal ${
          error ? "text-red-800" : "text-gray-400"
        }`}
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`border rounded-[6px] p-2 ${
          error ? "border-red-800" : "border"
        } focus:border-primary ${className}`}
      />
      {error && (
        <span className="text-red-800 text-xs font-normal">{error}</span>
      )}
    </div>
  );
};

export default InputField;
