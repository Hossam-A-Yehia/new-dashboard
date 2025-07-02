import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { expect, describe, it } from "vitest";
import NoData from "./NoDate";

describe("NoData Component", () => {
  it("renders the icon with correct class and animation", () => {
    render(<NoData />);
    const iconElement = screen.getByTestId("no-data-icon");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass(
      "text-gray-400 text-4xl mb-4 animate-bounce"
    );
  });

  it("renders the 'No Data Available' heading with correct styles", () => {
    render(<NoData />);
    const headingElement = screen.getByText("No Data Available");
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveClass(
      "text-2xl text-gray-700 font-bold mb-2 text-center"
    );
  });

  it("renders the description paragraph with correct text and styles", () => {
    render(<NoData />);
    const paragraphElement = screen.getByText(
      "Oops! It looks like there's no data to display at the moment. Please check back later or try refreshing the page."
    );
    expect(paragraphElement).toBeInTheDocument();
    expect(paragraphElement).toHaveClass("text-gray-500 mb-6 text-center");
  });

  it("applies the correct container styles", () => {
    render(<NoData />);
    const container = screen.getByTestId("no-data-container");
    expect(container).toHaveClass(
      "flex flex-col items-center justify-center p-4 w-full"
    );
  });
});
