import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageInput from "./MessageInput";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockOnSubmit = vi.fn();

describe("MessageInput Component", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test("renders the component correctly", () => {
    render(<MessageInput onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByTestId("message")).toBeDefined();
    expect(screen.getByTestId("file-input")).toBeDefined();
    expect(screen.getByTestId("submit-button")).toBeDefined();
  });

  test("handles message input change", () => {
    render(<MessageInput onSubmit={mockOnSubmit} isLoading={false} />);
    fireEvent.change(screen.getByTestId("message"), {
      target: { value: "Hello, this is a test message" },
    });
    expect(screen.getByTestId("message")).toHaveValue(
      "Hello, this is a test message"
    );
  });

  test("handles file selection and removal", async () => {
    render(<MessageInput onSubmit={mockOnSubmit} isLoading={false} />);
    const file = new File(["file content"], "test-file.txt", {
      type: "text/plain",
    });
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [file] },
    });
    expect(screen.getByText("test-file.txt")).toBeDefined();
    fireEvent.click(screen.getByText("×"));

    await waitFor(() => {
      expect(screen.queryByText("test-file.txt")).toBeNull();
    });
  });

  test("triggers onSubmit when form is submitted", async () => {
    render(<MessageInput onSubmit={mockOnSubmit} isLoading={false} />);

    fireEvent.change(screen.getByTestId("message"), {
      target: { value: "Test message" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { message: "Test message", file: null },
        expect.any(Object)
      );
    });
  });
});
