"use client";

import PhoneInput, { type Value } from "react-phone-number-input";

type PhoneNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: "UZ";
  className?: string;
};

export default function PhoneNumberInput({
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  defaultCountry = "UZ",
  className = "",
}: PhoneNumberInputProps) {
  return (
    <PhoneInput
      international
      defaultCountry={defaultCountry}
      countryCallingCodeEditable={false}
      value={value as Value}
      onChange={(next) => onChange(next || "")}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`phone-input ${className}`.trim()}
    />
  );
}
