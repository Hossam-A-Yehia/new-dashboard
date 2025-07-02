import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import { CheckboxGroupForValues } from "./CheckboxGroup";

describe("CheckboxGroupForValues Component", () => {
  const options = [
    { id: 1, name_en: "Option 1", name_es: "Opción 1", attributesId: "1" },
    { id: 2, name_en: "Option 2", name_es: "Opción 2", attributesId: "2" },
  ];

  const mockOnChange = vi.fn();

  it("renders the title", () => {
    render(
      <CheckboxGroupForValues
        title="Test Title"
        options={options}
        selectedOptions={[]}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the correct option labels based on language", () => {
    render(
      <CheckboxGroupForValues
        title="Test Title"
        options={options}
        selectedOptions={[]}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });
});
