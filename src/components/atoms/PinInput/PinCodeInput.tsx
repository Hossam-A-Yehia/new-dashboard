import React, { useRef, useState } from "react";
import "./pinInput.css";
import { PinCodeInputProps } from "@/types/Atoms";

const PinCodeInput: React.FC<PinCodeInputProps> = ({
  onChange,
  errors,
  touched,
  name,
}) => {
  const [values, setValues] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues.join(""));

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (values[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex space-x-5 justify-center" lang="en" dir="ltr">
      {values.map((value, index) => (
        <input
          data-testid={name}
          name={name}
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => e.key === "Backspace" && handleBackspace(index)}
          className={`input-pin ${
            errors && touched
              ? "input-error"
              : touched
              ? "input-valid"
              : "input-default"
          }`}
        />
      ))}
    </div>
  );
};

export default PinCodeInput;
