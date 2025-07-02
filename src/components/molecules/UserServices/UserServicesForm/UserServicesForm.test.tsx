import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserServicesForm from "./UserServicesForm";
import { SUPPLIER } from "@/constants/Constants";

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/useCategories", () => ({
  useFetchUserCategories: () => ({
    data: {
      data: {
        payload: [
          {
            category: {
              id: "1",
              name_en: "Category 1",
              name_ar: "فئة 1",
            },
          },
        ],
      },
    },
  }),
}));

vi.mock("@/hooks/useServices", () => ({
  useFetchCategoriesServices: () => ({
    data: {
      payload: [
        { id: "1", name_en: "Service 1" },
        { id: "2", name_en: "Service 2" },
      ],
    },
    isLoading: false,
  }),
  useMutateAddUserService: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => "en",
}));

describe("UserServicesForm", () => {
  const defaultProps = {
    userId: 1,
    userType: 1,
    userServices: {
      data: [{ service_id: 1 }],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form elements with correct test IDs", () => {
    render(<UserServicesForm {...defaultProps} />);

    expect(screen.getByTestId("edit-category")).toBeDefined();
  });

  it("displays supplier-specific text when userType is SUPPLIER", () => {
    render(<UserServicesForm {...defaultProps} userType={SUPPLIER} />);

    expect(
      screen.getByText("update_user_services.product_group")
    ).toBeDefined();
    expect(
      screen.getByText(
        "update_user_services.select_your_product_group_placeholder"
      )
    ).toBeDefined();
  });

  it("displays service-specific text when userType is not SUPPLIER", () => {
    render(<UserServicesForm {...defaultProps} />);

    expect(screen.getByText("update_user_services.services")).toBeDefined();
    expect(
      screen.getByText("update_user_services.select_your_services_placeholder")
    ).toBeDefined();
  });
});
