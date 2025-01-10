import InspectionPreview from "@/types/InspectionPreview";
import { render, screen } from "@testing-library/react";
import InspectionElement from "@/components/InspectionList/InspectionElement";

describe("InspectionElement", () => {

  const mockFinishedInspection : InspectionPreview = {
    company_info_id: "",
    company_name: "test_company",
    label_info_id: "",
    manufacturer_info_id: "test_manufacturer",
    picture_set_id: "",
    sample_id: "",
    id: "1",
    product_name: "Fertilizer 1",
    upload_date: new Date().toDateString(),
    updated_at: new Date(new Date().getDate()+5).toDateString()
  }
  const mockUnfinishedInspection : InspectionPreview = {
    company_info_id: "",
    company_name: "test_company",
    label_info_id: "",
    manufacturer_info_id: "test_manufacturer",
    picture_set_id: "",
    sample_id: "",
    id: "2",
    product_name: "Fertilizer 2",
    upload_date: new Date().toDateString(),
    updated_at: new Date().toDateString()
  }

  const handleClick = jest.fn();

  it("renders an finished InspectionElement and check that all elements are present and that the error icon is not present", () => {
    render(<InspectionElement inspection={mockFinishedInspection} key={mockUnfinishedInspection.id} handleClick={() => {}} />);
    expect(screen.getByText("Fertilizer 1")).toBeInTheDocument();
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
  });

  it("renders an unfinished InspectionElement and check that all elements are present and that the error icon is present", () => {
    render(<InspectionElement inspection={mockUnfinishedInspection} key={mockUnfinishedInspection.id} handleClick={() => {}} />);
    expect(screen.getByText("Fertilizer 2")).toBeInTheDocument();
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("clicks on the InspectionElement and check that the handleClick function has been called", () => {
    render(<InspectionElement inspection={mockFinishedInspection} key={mockUnfinishedInspection.id} handleClick={handleClick} />);
    screen.getByText("Fertilizer 1").click();
    expect(handleClick).toHaveBeenCalled();
  });
});
