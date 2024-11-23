import {
  DEFAULT_BASE_INFORMATION,
  DEFAULT_LABEL_DATA,
  DEFAULT_ORGANIZATION,
  LabelData,
  Organization,
} from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import OrganizationsForm from "../OrganizationsForm";

const Wrapper = ({
  initialData,
  onStateChange,
}: {
  initialData: LabelData;
  onStateChange?: (data: LabelData) => void;
}) => {
  const [labelData, setLabelData] = useState<LabelData>(initialData);
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  useEffect(() => {
    if (onStateChange) {
      onStateChange(labelData);
    }
  }, [labelData, onStateChange]);

  return (
    <FormProvider {...methods}>
      <OrganizationsForm
        title="Test Organizations"
        labelData={labelData}
        setLabelData={setLabelData}
      />
    </FormProvider>
  );
};

describe("OrganizationsForm Rendering", () => {
  it("should render the form title", () => {
    render(<Wrapper initialData={DEFAULT_LABEL_DATA} />);

    const title = screen.getByTestId("form-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Test Organizations");
  });

  it("should render the correct number of organizations", () => {
    render(
      <Wrapper
        initialData={{
          organizations: [DEFAULT_ORGANIZATION, DEFAULT_ORGANIZATION],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    const organizationFields = screen.getAllByTestId(/organization-\d+/);
    expect(organizationFields).toHaveLength(2);
  });

  it("should render all inputs for each organization", () => {
    render(<Wrapper initialData={DEFAULT_LABEL_DATA} />);

    expect(
      screen.getByPlaceholderText("Enter organization name"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter website")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter phone number"),
    ).toBeInTheDocument();
  });

  it("should render the Add Organization button", () => {
    render(
      <Wrapper
        initialData={{
          organizations: [],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    const addButton = screen.getByTestId("add-org-btn");
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent("Add Organization");
  });
});

describe("OrganizationsForm Functionality", () => {
  it("should add a new organization when Add Organization button is clicked", () => {
    render(
      <Wrapper
        initialData={{
          organizations: [],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    expect(screen.queryAllByTestId(/organization-\d+/)).toHaveLength(0);
    const addButton = screen.getByTestId("add-org-btn");
    fireEvent.click(addButton);
    expect(screen.queryAllByTestId(/organization-\d+/)).toHaveLength(1);
  });

  it("should remove an organization when Remove button is clicked", () => {
    render(<Wrapper initialData={DEFAULT_LABEL_DATA} />);

    expect(screen.queryAllByTestId(/organization-\d+/)).toHaveLength(1);
    const removeButton = screen.getByTestId("remove-org-btn-0");
    fireEvent.click(removeButton);
    expect(screen.queryAllByTestId(/organization-\d+/)).toHaveLength(0);
  });

  it("should update watched organizations in state when a field is updated", () => {
    const mockStateChange = jest.fn();

    render(
      <Wrapper
        initialData={DEFAULT_LABEL_DATA}
        onStateChange={mockStateChange}
      />,
    );

    const input = document.querySelector(
      'input[name="organizations.0.address.value"]',
    );
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { value: "Updated Address" } });
    expect(input).toHaveValue("Updated Address");

    expect(mockStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        organizations: [
          expect.objectContaining({
            address: expect.objectContaining({
              value: "Updated Address",
            }),
          }),
        ],
      }),
    );
  });

  it("should update the organization field verification when the Verified button is clicked", () => {
    const mockStateChange = jest.fn();

    render(
      <Wrapper
        initialData={DEFAULT_LABEL_DATA}
        onStateChange={mockStateChange}
      />,
    );

    const verifyButton = screen.getByTestId(
      "toggle-verified-btn-organizations.0.address.verified",
    );
    expect(verifyButton).toBeInTheDocument();

    fireEvent.click(verifyButton);

    expect(mockStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        organizations: [
          expect.objectContaining({
            address: expect.objectContaining({
              verified: true,
            }),
          }),
        ],
      }),
    );
  });

  it("should mark all fields as Verified and update the data when Mark All Verified button is clicked", () => {
    const mockStateChange = jest.fn();

    render(
      <Wrapper
        initialData={DEFAULT_LABEL_DATA}
        onStateChange={mockStateChange}
      />,
    );

    const verifyAllButton = screen.getByTestId("verify-all-btn-0");
    expect(verifyAllButton).toBeInTheDocument();

    fireEvent.click(verifyAllButton);
    expect(verifyAllButton).toBeDisabled();
    expect(mockStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        organizations: [
          expect.objectContaining({
            name: expect.objectContaining({
              verified: true,
            }),
            address: expect.objectContaining({
              verified: true,
            }),
            website: expect.objectContaining({
              verified: true,
            }),
            phoneNumber: expect.objectContaining({
              verified: true,
            }),
          }),
        ],
      }),
    );
  });

  it("should disable the Verify All button if all fields are already Verified", () => {
    const verifiedOrg: Organization = {
      name: {
        value: "",
        verified: true,
      },
      address: {
        value: "",
        verified: true,
      },
      website: {
        value: "",
        verified: true,
      },
      phoneNumber: {
        value: "",
        verified: true,
      },
    };

    render(
      <Wrapper
        initialData={{
          organizations: [verifiedOrg],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    const verifyAllButton = screen.getByTestId("verify-all-btn-0");
    expect(verifyAllButton).toBeDisabled();
  });

  it("should mark all fields as Unverified and update the data when Mark All Unverified button is clicked", () => {
    const mockStateChange = jest.fn();

    const partiallyVerifiedOrg = {
      name: {
        value: "Test Name",
        verified: true,
      },
      address: {
        value: "123 Test St",
        verified: false,
      },
      website: {
        value: "https://test.com",
        verified: false,
      },
      phoneNumber: {
        value: "123-456-7890",
        verified: false,
      },
    };

    render(
      <Wrapper
        initialData={{
          organizations: [partiallyVerifiedOrg],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
        onStateChange={mockStateChange}
      />,
    );

    const unverifyAllButton = screen.getByTestId("unverify-all-btn-0");
    expect(unverifyAllButton).toBeInTheDocument();

    fireEvent.click(unverifyAllButton);
    expect(unverifyAllButton).toBeDisabled();

    expect(mockStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        organizations: [
          expect.objectContaining({
            name: expect.objectContaining({
              verified: false,
            }),
            address: expect.objectContaining({
              verified: false,
            }),
            website: expect.objectContaining({
              verified: false,
            }),
            phoneNumber: expect.objectContaining({
              verified: false,
            }),
          }),
        ],
      }),
    );
  });

  it("should disable the Mark All Unverified button if all fields are already Unverified", () => {
    const allUnverifiedOrg = {
      name: {
        value: "Test Name",
        verified: false,
      },
      address: {
        value: "123 Test St",
        verified: false,
      },
      website: {
        value: "https://test.com",
        verified: false,
      },
      phoneNumber: {
        value: "123-456-7890",
        verified: false,
      },
    };

    render(
      <Wrapper
        initialData={{
          organizations: [allUnverifiedOrg],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    const unverifyAllButton = screen.getByTestId("unverify-all-btn-0");
    expect(unverifyAllButton).toBeDisabled();
  });
});

describe("OrganizationsForm Edge Cases", () => {
  it("should render correctly when no organizations are in labelData", () => {
    render(
      <Wrapper
        initialData={{
          organizations: [],
          baseInformation: DEFAULT_BASE_INFORMATION,
        }}
      />,
    );

    const addButton = screen.getByTestId("add-org-btn");
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent("Add Organization");

    const organizationFields = screen.queryAllByTestId(/organization-\d+/);
    expect(organizationFields).toHaveLength(0);
  });
});
