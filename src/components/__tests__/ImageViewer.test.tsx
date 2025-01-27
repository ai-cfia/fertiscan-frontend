import theme from "@/app/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import ImageViewer from "@/components/ImageViewer";





describe("ImageViewer Component",()=>{

  const mockImageFiles = [
    new File(["test image"], "/public/img/image.png", { type: "image/png" }),
  ];

  global.URL.createObjectURL = jest.fn(() => "blob:http://localhost:3001/6f71c9d8-8758-44da-8a37-2cb38689af13" );

  it("renders the ImageViewer component and its sub-components",()=>{
    render(
      <ThemeProvider theme={theme}>
        <ImageViewer imageFiles={mockImageFiles}/>
      </ThemeProvider>,
    );

    // Check if the image is rendered
    expect(screen.getByTestId("image-slide")).toBeInTheDocument();
  });

})
