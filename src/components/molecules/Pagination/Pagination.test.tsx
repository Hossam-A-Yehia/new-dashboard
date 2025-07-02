import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, test, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const onPageChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct page numbers based on current and last pages", () => {
    const mockProps = {
      currentPage: 3,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);

    const pageButtons = screen.getAllByRole("button").filter((button) => {
      return !button.querySelector("svg");
    });

    expect(pageButtons.length).toBe(5);
    expect(pageButtons[0]).toHaveTextContent("1");
    expect(pageButtons[1]).toHaveTextContent("2");
    expect(pageButtons[2]).toHaveTextContent("3");
    expect(pageButtons[3]).toHaveTextContent("4");
    expect(pageButtons[4]).toHaveTextContent("5");
  });

  test('disables the "Previous" button on the first page', () => {
    const mockProps = {
      currentPage: 1,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);
    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  test('disables the "Next" button on the last page', () => {
    const mockProps = {
      currentPage: 5,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange with correct page when page button is clicked", () => {
    const mockProps = {
      currentPage: 3,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);

    const pageButton = screen.getByText("2");
    fireEvent.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct page when 'Previous' button is clicked", () => {
    const mockProps = {
      currentPage: 3,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);

    const prevButton = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct page when 'Next' button is clicked", () => {
    const mockProps = {
      currentPage: 3,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("highlights the current page button", () => {
    const mockProps = {
      currentPage: 3,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);

    const pageButtons = screen.getAllByRole("button").filter((button) => {
      return !button.querySelector("svg");
    });

    expect(pageButtons[2]).toHaveClass("bg-orange-500 text-white");
  });

  it("disables the 'Previous' button on the first page", () => {
    const mockProps = {
      currentPage: 1,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);
    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it("disables the 'Next' button on the last page", () => {
    const mockProps = {
      currentPage: 5,
      lastPage: 5,
      onPageChange,
    };

    render(<Pagination {...mockProps} />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});
