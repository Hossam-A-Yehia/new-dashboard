import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with children", () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click Me</Button>
    );

    fireEvent.click(getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const { getByText } = render(<Button disabled>Click Me</Button>);
    const button = getByText("Click Me");

    expect(button).toBeDisabled();
  });

  it("is not clickable when disabled", () => {
    const handleClick = vi.fn();
    const { getByText } = render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );

    fireEvent.click(getByText("Click Me"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows loading spinner when loading is true", () => {
    const { getByLabelText, queryByText } = render(
      <Button loading>Click Me</Button>
    );
    expect(getByLabelText("Loading")).toBeInTheDocument();
    expect(queryByText("Click Me")).not.toBeInTheDocument();
  });

  it("applies additional classes if provided", () => {
    const { container } = render(
      <Button additionalClasses="extra-class">Click Me</Button>
    );
    expect(container.firstChild).toHaveClass("extra-class");
  });

  it("disables the button if loading is true", () => {
    const { getByRole } = render(<Button loading>Loading</Button>);
    expect(getByRole("button")).toBeDisabled();
  });
});
