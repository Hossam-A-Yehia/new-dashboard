import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import UserCard from "./UserCard";

vi.mock("@/components/atoms/Image/CustomImage", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    <img src={src} alt={alt} className={className} data-testid="custom-image" />
  ),
}));

vi.mock("@/components/atoms/Text/Text", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span className={className} data-testid="text-component">
      {children}
    </span>
  ),
}));

describe("UserCard", () => {
  const defaultProps = {
    id: "1",
    coverImage: "/cover.jpg",
    logoImg: "/logo.jpg",
    name: "John Doe",
    city: "New York",
    isChecked: false,
    onCheckboxChange: vi.fn(),
    isDisabled: false,
  };

  it("renders with required props", () => {
    const { container } = render(<UserCard {...defaultProps} />);
    expect(container.firstChild).toHaveClass("border-gray-300");
  });

  it("applies checked styles when isChecked is true", () => {
    const { container } = render(
      <UserCard {...defaultProps} isChecked={true} />
    );
    expect(container.firstChild).toHaveClass("border-orange-600");
  });

  it("handles checkbox changes", () => {
    const onCheckboxChange = vi.fn();
    const { getByRole } = render(
      <UserCard {...defaultProps} onCheckboxChange={onCheckboxChange} />
    );

    const checkbox = getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onCheckboxChange).toHaveBeenCalled();
  });

  it("disables checkbox when isDisabled is true", () => {
    const { getByRole } = render(
      <UserCard {...defaultProps} isDisabled={true} />
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("truncates long names", () => {
    const longName = "This is a very long name that should be truncated";
    const { getAllByTestId } = render(
      <UserCard {...defaultProps} name={longName} />
    );
    const nameElement = getAllByTestId("text-component")[0];
    expect(nameElement.textContent).toBe(`${longName.slice(0, 18)}...`);
  });

  it("renders country when provided", () => {
    const { getAllByTestId } = render(
      <UserCard {...defaultProps} country="USA" />
    );

    const textComponents = getAllByTestId("text-component");
    const countryComponent = textComponents.find(
      (el) => el.textContent === "USA,"
    );
    expect(countryComponent).toBeTruthy();
  });

  it("renders images with correct sources", () => {
    const { getAllByTestId } = render(<UserCard {...defaultProps} />);
    const images = getAllByTestId("custom-image");
    expect(images[0]).toHaveAttribute("src", defaultProps.coverImage);
    expect(images[1]).toHaveAttribute("src", defaultProps.logoImg);
  });
});
