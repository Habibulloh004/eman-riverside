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

function normalizePhoneValue(value: string): string {
  return value.trim().replace(/[^\d+]/g, "");
}

export default function PhoneNumberInput({
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  defaultCountry = "UZ",
  className = "",
}: PhoneNumberInputProps) {
  const normalizedValue = normalizePhoneValue(value);

  return (
    <PhoneInput
      international
      defaultCountry={defaultCountry}
      countryCallingCodeEditable={false}
      value={normalizedValue as Value}
      onChange={(next) => onChange(next || "")}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`phone-input ${className}`.trim()}
    />
  );
}
