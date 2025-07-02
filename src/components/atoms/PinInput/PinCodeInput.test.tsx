import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import PinCodeInput from "./PinCodeInput.tsx";
describe("PinCodeInput Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <PinCodeInput onChange={vi.fn()} name="pin" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("calls onChange correctly", () => {
    const handleChange = vi.fn();
    const { getAllByRole } = render(
      <PinCodeInput onChange={handleChange} name="pin" />
    );
    const inputs = getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(handleChange).toHaveBeenCalledWith("1");

    fireEvent.change(inputs[1], { target: { value: "2" } });
    expect(handleChange).toHaveBeenCalledWith("12");
  });

  it("focuses the next input when a value is entered", () => {
    const { getAllByRole } = render(
      <PinCodeInput onChange={vi.fn()} name="pin" />
    );
    const inputs = getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(inputs[1]).toHaveFocus();
  });

  it("focuses the previous input when backspace is pressed on an empty input", () => {
    const { getAllByRole } = render(
      <PinCodeInput onChange={vi.fn()} name="pin" />
    );
    const inputs = getAllByRole("textbox");

    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[1], { target: { value: "" } });
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(inputs[0]).toHaveFocus();
  });

  it("applies error classes correctly", () => {
    const { getAllByRole } = render(
      <PinCodeInput onChange={vi.fn()} name="pin" errors="Error" touched />
    );
    const inputs = getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveClass("input-error");
    });
  });

  it("applies valid classes correctly when touched but no errors", () => {
    const { getAllByRole } = render(
      <PinCodeInput onChange={vi.fn()} name="pin" touched />
    );
    const inputs = getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveClass("input-valid");
    });
  });
});
