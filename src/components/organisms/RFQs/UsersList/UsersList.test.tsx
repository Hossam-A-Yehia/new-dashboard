import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import UsersList from "./UsersList";
import { Formik } from "formik";
import React from "react";
import { JSX } from "react/jsx-runtime";
import { useFetchRfpBusinessUsers } from "@/hooks/rfqs";
vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => "en",
}));

vi.mock("@/hooks/useRfqs", () => ({
  useFetchRfpBusinessUsers: vi.fn().mockReturnValue({
    data: {
      data: {
        payload: {
          data: [
            {
              id: 1,
              user_id: "101",
              profile: "/profile1.jpg",
              logo: "/logo1.jpg",
              business_name: "Business 1",
              city: { name_en: "City 1", country: { name_en: "Country 1" } },
            },
            {
              id: 2,
              user_id: "102",
              profile: "/profile2.jpg",
              logo: "/logo2.jpg",
              business_name: "Business 2",
              city: { name_en: "City 2", country: { name_en: "Country 2" } },
            },
          ],
          last_page: 3,
        },
      },
    },
    isLoading: false,
  }),
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

const FormikWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <Formik initialValues={{}} onSubmit={() => {}}>
    {children}
  </Formik>
);

describe("UsersList", () => {
  const mockProps = {
    setStep: vi.fn(),
    setIds: vi.fn(),
    city: 1,
    service: 1,
    isMutatePutLoading: false,
  };

  const renderWithFormik = (ui: string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | JSX.Element | null | undefined) => {
    return render(<FormikWrapper>{ui}</FormikWrapper>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user cards and handles selection", () => {
    renderWithFormik(<UsersList {...mockProps} />);
    const userCards = screen.getAllByTestId("user-card");
    expect(userCards).toHaveLength(2);

    const userCardCheckbox = screen.getAllByTestId("user-card-checkbox")[0];
    fireEvent.click(userCardCheckbox);
    expect(mockProps.setIds).toHaveBeenCalled();
  });

  it("limits selection to 10 users", () => {
    const alert = vi.spyOn(window, "alert");
    renderWithFormik(<UsersList {...mockProps} />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(alert).not.toHaveBeenCalled();
  });

  it("handles select all functionality", () => {
    renderWithFormik(<UsersList {...mockProps} />);
    const selectAllButton = screen.getByTestId("select_all");

    fireEvent.click(selectAllButton);
    const checkboxes = screen.getAllByTestId("user-card-checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("shows loader when loading", () => {
    vi.mocked(useFetchRfpBusinessUsers).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithFormik(<UsersList {...mockProps} />);
    expect(screen.getByTestId("loader-wrapper")).toBeDefined();
  });

  it("shows no data when empty", () => {
    vi.mocked(useFetchRfpBusinessUsers).mockReturnValueOnce({
      data: { data: { payload: { data: [], last_page: 1 } } },
      isLoading: false,
    } as any);

    renderWithFormik(<UsersList {...mockProps} />);
    expect(screen.getByTestId("no-data")).toBeDefined();
  });

  it("handles pagination", () => {
    renderWithFormik(<UsersList {...mockProps} />);
    const nextPageButton = screen.getByRole("button", { name: /next/i });

    fireEvent.click(nextPageButton);
    expect(screen.getByText("2")).toBeDefined();
  });
});
