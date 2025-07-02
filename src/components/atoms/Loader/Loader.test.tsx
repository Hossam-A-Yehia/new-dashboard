import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import Loader from "./Loader";

describe("Loader Component", () => {
  it("renders the spinner and loading text correctly", () => {
    render(<Loader />);

    const spinner = screen.getByTestId("loader-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin text-gray-500 h-8 w-8");

    const loadingText = screen.getByTestId("loader-text");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent("Loading...");
    expect(loadingText).toHaveClass("text-gray-500 text-lg");

    const container = screen.getByTestId("loader-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      "flex flex-col items-center justify-center space-y-4 p-4"
    );
  });
});
