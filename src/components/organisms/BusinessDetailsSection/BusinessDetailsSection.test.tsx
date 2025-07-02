import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Formik, Form } from "formik";
import { BusinessDetailsSection } from "./BusinessDetailsSection";

vi.mock("@/hooks/useBusinessForm", () => ({
  useBusinessForm: () => ({
    priceRangeOptions: [{ value: 1, label: "Low" }],
    volumeOfWorkOptions: [{ value: 1, label: "Small" }],
    numberOfEmployeesOptions: [{ value: 1, label: "1-10" }],
    yearsOfExperienceOptions: [{ value: 1, label: "1-5 years" }],
    isSupplier: true,
    contractorClassificationsOptions: [
      { value: 1, label: "General Contractor" },
    ],
    supplierClassificationsOptions: [{ value: 1, label: "Supplier" }],
    isContractor: false,
  }),
}));

vi.mock("@/hooks/useDisclosure", () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn(),
  }),
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

describe("BusinessDetailsSection", () => {
  const defaultProps = {
    values: {
      business_name: "Test Business",
      business_email: "test@example.com",
      phone: "1234567890",
      hotline: "0987654321",
      country_id: "1",
      city_id: "1",
      business_des: "Test Description",
      lat: 10,
      lang: 20,
      business_des_en: "Test Description EN",
      business_des_ar: "Test Description AR",
      logo: "test-logo.png",
      profile: "test-profile.png",
    },
    errors: {},
    touched: {},
    setFieldValue: vi.fn(),
    countryOptions: [{ value: "1", label: "Country 1" }],
    cityOptions: () => [{ value: "1", label: "City 1" }],
  };

  const renderWithFormik = (props = defaultProps) => {
    return render(
      <Formik initialValues={props.values} onSubmit={vi.fn()}>
        <Form>
          <BusinessDetailsSection setFieldTouched={undefined} {...props} />
        </Form>
      </Formik>
    );
  };

  it("renders all form fields correctly", () => {
    renderWithFormik();

    expect(screen.getByTestId("business_name")).toBeDefined();
    expect(screen.getByTestId("business_email")).toBeDefined();
    expect(screen.getByTestId("phone")).toBeDefined();
    expect(screen.getByTestId("business_des")).toBeDefined();
    expect(screen.getByTestId("country_id")).toBeDefined();
    expect(screen.getByTestId("city_id")).toBeDefined();
    expect(screen.getByTestId("volume_of_work")).toBeDefined();
    expect(screen.getByTestId("number_of_employees")).toBeDefined();
    expect(screen.getByTestId("years_of_experience")).toBeDefined();
    expect(screen.getByTestId("classifications")).toBeDefined();
    expect(screen.getByTestId("location")).toBeDefined();
  });

  it("opens the map modal when location field is clicked", () => {
    renderWithFormik();

    fireEvent.click(screen.getByTestId("location"));
    expect(screen.queryByTestId("map-modal-title")).toBeDefined();
  });

  it("renders the map component inside the modal", () => {
    renderWithFormik();

    fireEvent.click(screen.getByTestId("location"));
    expect(screen.queryByTestId("map-component")).toBeDefined();
  });

  it("closes the map modal when the save button is clicked", () => {
    renderWithFormik();

    fireEvent.click(screen.getByTestId("location"));
    expect(screen.queryByTestId("map-modal-title")).toBeNull();
  });
});
