import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomImage from "./CustomImage";
import { describe, expect, it } from "vitest";

describe("CustomImage Component", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test Image",
    width: 200,
    height: 100,
    className: "custom-class",
  };

  it("renders with the correct src, alt, width, height, and className", () => {
    const { getByRole } = render(<CustomImage {...defaultProps} />);
    const image = getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test Image");
    expect(image).toHaveAttribute("width", "200");
    expect(image).toHaveAttribute("height", "100");
    expect(image).toHaveClass("custom-class");
  });

  it("sets loading attribute to lazy", () => {
    const { getByRole } = render(<CustomImage {...defaultProps} />);
    const image = getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("applies additional classes if provided", () => {
    const { getByRole } = render(
      <CustomImage {...defaultProps} className="custom-class extra-class" />
    );
    const image = getByRole("img");

    expect(image).toHaveClass("custom-class");
    expect(image).toHaveClass("extra-class");
  });

  it("does not set width and height attributes if fill is true", () => {
    const { getByRole } = render(
      <CustomImage {...defaultProps} fill={true} />
    );
    const image = getByRole("img");

    expect(image).not.toHaveAttribute("width");
    expect(image).not.toHaveAttribute("height");
    expect(image).toHaveStyle({
      width: "100%",
      height: "100%",
      objectFit: "cover",
    });
  });
});
