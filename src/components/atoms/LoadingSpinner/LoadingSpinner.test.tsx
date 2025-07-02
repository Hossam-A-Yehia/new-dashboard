import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("renders the loading spinner correctly", () => {
    const { getByLabelText } = render(<LoadingSpinner />);

    const spinner = getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("loading-spinner");
  });

  it("contains the spinner element", () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerDiv = container.querySelector(".spinner");
    expect(spinnerDiv).toBeInTheDocument();
  });
});
