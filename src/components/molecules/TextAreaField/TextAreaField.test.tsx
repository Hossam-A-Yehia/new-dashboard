import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextAreaField from "./TextAreaField";
import { Formik } from "formik";

describe("TextAreaField Component", () => {
  const renderTextAreaField = (props = {}) => {
    render(
      <Formik initialValues={{ exampleField: "" }} onSubmit={vi.fn()}>
        <TextAreaField id={""} placeholder={""} errors={undefined} touched={undefined} {...props} name="exampleField" />
      </Formik>
    );
  };

  it("renders the label if provided", () => {
    renderTextAreaField({
      label: "Test Label",
      id: "test-id",
    });
    expect(screen.getByLabelText("Test Label")).toBeDefined();
  });

  it("renders the TextArea component with correct props", () => {
    renderTextAreaField({
      id: "test-id",
      required: true,
      placeholder: "Enter text",
    });

    const textArea = screen.getByPlaceholderText("Enter text");
    expect(textArea).toBeDefined();
    expect(textArea).toHaveAttribute("required");
    expect(textArea).toHaveAttribute("id", "test-id");
  });

  it("displays the warning icon when there is an error and the field is touched", () => {
    renderTextAreaField({
      errors: "This field is required",
      touched: true,
      id: "test-id",
    });
    expect(screen.getByTestId("warning-icon")).toBeDefined();
  });

  it("does not display the error message when errors are not present", () => {
    renderTextAreaField({
      errors: undefined,
      touched: false,
      id: "test-id",
    });
    expect(screen.queryByText("This field is required")).toBeNull();
  });
});
