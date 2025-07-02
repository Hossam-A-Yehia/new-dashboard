import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import "@testing-library/jest-dom";
import { CheckboxGroup } from "./CheckboxGroup";

describe("CheckboxGroup Component", () => {
  const options = [
    { id: 1, name_en: "Option 1", name_es: "Opción 1" },
    { id: 2, name_en: "Option 2", name_es: "Opción 2" },
  ];

  it("renders the title", () => {
    render(
      <CheckboxGroup
        title="Test Title"
        options={options}
        selectedOptions={[]}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders a loader when isLoading is true", () => {
    render(
      <CheckboxGroup
        title="Test Title"
        options={options}
        selectedOptions={[]}
        onChange={() => {}}
        isLoading={true}
      />
    );

    const loaderContainer = screen.queryByTestId("loader-container");
    expect(loaderContainer).toBeInTheDocument();
  });

  it("renders NoDataSection when options are empty", () => {
    render(
      <CheckboxGroup
        title="Test Title"
        options={[]}
        selectedOptions={[]}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("No Data Available")).toBeInTheDocument();
  });
});
