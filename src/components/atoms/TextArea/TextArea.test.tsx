import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextArea from "./TextArea";

describe("TextArea Component", () => {
  const onChangeMock = vi.fn();

  const renderTextArea = (props = {}) => {
    render(<TextArea id={""} name={""} {...props} onChange={onChangeMock} />);
  };

  it("renders the TextArea component with the correct props", () => {
    renderTextArea({
      id: "test-id",
      name: "test-name",
      rows: 5,
      cols: 30,
      placeholder: "Enter text",
    });

    const textArea = screen.getByTestId("test-id");
    expect(textArea).toBeDefined();
    expect(textArea).toHaveAttribute("id", "test-id");
    expect(textArea).toHaveAttribute("name", "test-name");
    expect(textArea).toHaveAttribute("rows", "5");
    expect(textArea).toHaveAttribute("cols", "30");
  });

  it("calls the onChange handler when the value changes", () => {
    renderTextArea({
      id: "test-id",
      value: "",
      placeholder: "Enter text",
    });

    const textArea = screen.getByTestId("test-id");
    fireEvent.change(textArea, { target: { value: "New value" } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it("renders with the correct placeholder", () => {
    renderTextArea({
      id: "test-id",
      placeholder: "Enter text here",
    });
    const textArea = screen.getByTestId("test-id");
    expect(textArea).toHaveAttribute("placeholder", "Enter text here");
  });
});
