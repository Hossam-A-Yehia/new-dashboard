import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import Container from "./Container";

describe("Container Component", () => {
  it("renders with children", () => {
    const { getByText } = render(
      <Container>
        <p>Test Content</p>
      </Container>
    );
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies additional classes if provided", () => {
    const { container } = render(
      <Container additionalClasses="extra-class">
        <p>Test Content</p>
      </Container>
    );
    expect(container.firstChild).toHaveClass("container");
    expect(container.firstChild).toHaveClass("mx-auto");
    expect(container.firstChild).toHaveClass("extra-class");
  });

  it("defaults to base classes when no additional classes are provided", () => {
    const { container } = render(
      <Container>
        <p>Test Content</p>
      </Container>
    );
    expect(container.firstChild).toHaveClass("container");
    expect(container.firstChild).toHaveClass("mx-auto");
    expect(container.firstChild).not.toHaveClass("extra-class");
  });

  it("renders multiple children correctly", () => {
    const { getByText } = render(
      <Container>
        <p>Child 1</p>
        <p>Child 2</p>
      </Container>
    );
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });
});
