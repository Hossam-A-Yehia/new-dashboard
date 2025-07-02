import React from "react";
import "./textArea.css";
import { TextAreaProps } from "@/types/Atoms";

const TextArea: React.FC<TextAreaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  required,
  name,
  touched,
  errors,
  rows = 5,
  cols,
}) => (
  <textarea
    name={name}
    id={id}
    rows={rows}
    cols={cols}
    onChange={onChange}
    value={value}
    placeholder={placeholder}
    required={required}
    data-testid={id}
    className={`textarea ${
      errors && touched ? "textarea-error" : "textarea-default"
    } resize-none`}
  />
);

export default TextArea;
