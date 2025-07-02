import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserCategoryForm from "./UserCategoryForm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMutateAddUserCategory } from "@/hooks/useCategories";

vi.mock("i18next", () => ({
  t: vi.fn((key) => key),
}));

vi.mock("react-toastify", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

vi.mock("@/hooks/useCategories", () => ({
  useMutateAddUserCategory: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));
vi.mock("@/components/molecules/MultiSelectInput/MultiSelectInput", () => ({
  __esModule: true,
  default: vi.fn(({ id, label, placeholder, error, touched }) => (
    <div data-testid={id}>
      {label && <label data-testid={`${id}-label`}>{label}</label>}
      <input
        data-testid={`${id}-input`}
        placeholder={placeholder}
        aria-invalid={!!(touched && error)}
      />
      {touched && error && <div data-testid={`${id}-error`}>{error}</div>}
    </div>
  )),
}));

describe("UserCategoryForm", () => {
  const mockUserData = { id: 1 };
  const mockMappedCategories = [
    { value: 1, label: "Category 1" },
    { value: 2, label: "Category 2" },
  ];
  const mockUserCategoryIds = [1];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with MultiSelectInput and Button", () => {
    render(
      <UserCategoryForm
        userData={mockUserData}
        mappedCategories={mockMappedCategories}
        userCategoryIds={mockUserCategoryIds}
      />
    );
    expect(screen.getByTestId("category_id")).toBeDefined();
    expect(screen.getByTestId("category_id-label")).toHaveTextContent(
      "update_user_categories.select_your_categories"
    );
    expect(screen.getByTestId("category_id-input")).toHaveAttribute(
      "placeholder",
      "update_user_categories.select_your_categories_placeholder"
    );
    expect(
      screen.getByRole("button", {
        name: "update_user_categories.add_category",
      })
    ).toBeDefined();
  });

  it("displays an error when duplicate categories are selected", async () => {
    render(
      <UserCategoryForm
        userData={mockUserData}
        mappedCategories={mockMappedCategories}
        userCategoryIds={mockUserCategoryIds}
      />
    );
    fireEvent.change(screen.getByTestId("category_id-input"), {
      target: { value: "Category 1" },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "update_user_categories.add_category",
      })
    );
    await waitFor(() => {
      expect(screen.getByTestId("category_id-error")).toBeDefined();
    });
  });

  it("disables the button when isMutateLoading is true", () => {
    (useMutateAddUserCategory as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });
    render(
      <UserCategoryForm
        userData={mockUserData}
        mappedCategories={mockMappedCategories}
        userCategoryIds={mockUserCategoryIds}
      />
    );
    expect(
      screen.getByRole("button", {
        name: "update_user_categories.add_category",
      })
    ).toBeDisabled();
  });
});
