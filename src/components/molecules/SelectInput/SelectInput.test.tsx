import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Formik } from "formik";
import SelectInput from "./SelectInput";
import { OptionType } from "../../../types/Molecules";
import React from "react";

vi.mock("react-icons/io", () => ({
  IoMdWarning: () => <div data-testid="warning-icon">Warning Icon</div>,
}));

describe("SelectInput Component", () => {
  const mockOptions: OptionType[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const defaultProps = {
    id: "test-select",
    name: "testSelect",
    label: "Test Label",
    options: mockOptions,
    dataTestid: "select-input",
  };

  const renderWithFormik = (ui: React.ReactNode, initialValues = {}) => {
    return render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {() => ui}
      </Formik>
    );
  };

  it("renders with basic props", () => {
    renderWithFormik(<SelectInput {...defaultProps} />);

    const container = screen.getByTestId("select-input");
    expect(container).toBeDefined();

    const label = screen.getByText("Test Label");
    expect(label).toBeDefined();

    const select = screen.getByRole("combobox");
    expect(select).toBeDefined();
  });

  it("displays placeholder text when no value is selected", () => {
    const placeholder = "Custom Placeholder";
    renderWithFormik(
      <SelectInput {...defaultProps} placeholder={placeholder} />
    );

    expect(screen.getByText(placeholder)).toBeDefined();
  });

  it("shows error message when error and touched are true", () => {
    const errorMessage = "This field is required";
    renderWithFormik(
      <SelectInput {...defaultProps} error={errorMessage} touched={true} />
    );

    const errorContainer = screen.getByText(errorMessage);
    expect(errorContainer).toBeDefined();

    const warningIcon = screen.getByTestId("warning-icon");
    expect(warningIcon).toBeDefined();
  });

  it("applies additional classes when provided", () => {
    const additionalClasses = "custom-class-1 custom-class-2";
    renderWithFormik(
      <SelectInput {...defaultProps} additionalClasses={additionalClasses} />
    );

    const container = screen.getByTestId("select-input");
    expect(container).toHaveClass("custom-class-1", "custom-class-2");
  });

  it("calls custom onChange handler when provided", () => {
    const onChangeMock = vi.fn();
    renderWithFormik(<SelectInput {...defaultProps} onChange={onChangeMock} />);

    const select = screen.getByRole("combobox");
    fireEvent.keyDown(select, { key: "ArrowDown" });
    fireEvent.click(screen.getByText("Option 1"));

    expect(onChangeMock).toHaveBeenCalled();
  });

  it("displays initial value when provided", () => {
    const initialValues = { testSelect: "option1" };
    renderWithFormik(
      <SelectInput {...defaultProps} value={mockOptions[0]} />,
      initialValues
    );

    expect(screen.getByText("Option 1")).toBeDefined();
  });

  it("handles empty options array gracefully", () => {
    renderWithFormik(<SelectInput {...defaultProps} options={[]} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDefined();
    expect(screen.getByText("Select an option")).toBeDefined();
  });
});
