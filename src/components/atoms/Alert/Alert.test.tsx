import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders the success alert correctly", () => {
    const { getByText, container } = render(
      <Alert type="success" message="Success alert!" />
    );

    expect(getByText("Success alert!")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("alert-success");
  });

  it("renders the warning alert correctly", () => {
    const { getByText, container } = render(
      <Alert type="warning" message="Warning alert!" />
    );

    expect(getByText("Warning alert!")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("alert-warning");
  });

  it("renders the error alert correctly", () => {
    const { getByText, container } = render(
      <Alert type="error" message="Danger alert!" />
    );

    expect(getByText("Danger alert!")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("alert-error");
  });

  it("renders the info alert correctly", () => {
    const { getByText, container } = render(
      <Alert type="info" message="Info alert!" />
    );

    expect(getByText("Info alert!")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("alert-info");
  });

  it("displays the correct icon for each alert type", () => {
    const { container } = render(
      <Alert type="success" message="Success alert!" />
    );
    const icon = container.querySelector("svg");
    expect(icon).toHaveClass("icon-success");

    const { container: containerWarning } = render(
      <Alert type="warning" message="Warning alert!" />
    );
    const iconWarning = containerWarning.querySelector("svg");
    expect(iconWarning).toHaveClass("icon-warning");
  });

  it("does not render an alert if the message is empty", () => {
    const { queryByRole } = render(<Alert type="success" message="" />);
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });
});
