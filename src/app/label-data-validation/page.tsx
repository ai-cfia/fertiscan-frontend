import { Box, Container } from "@mui/material";

function LabelDataValidationPage() {
  return (
    <Container className="flex flex-col h-screen max-w-[1920px] overflow-hidden" maxWidth={false}>
      <Box className="p-4">
        stepper
      </Box>

      <Box className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <Box className="flex-1 p-4 flex justify-center">
          {/* Carousel Placeholder: To be removed, just for testing */}
          <Box className="w-full p-4 text-center font-bold bg-gray-300">
            Carousel Placeholder
          </Box>
        </Box>

        <Box className="flex flex-1 p-4 justify-center overflow-y-auto">
          {/* Form Placeholder: To be removed, just for testing */}
          <Box className="w-full h-[130vh] p-4 text-center font-bold bg-gray-400">
            Form Placeholder
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LabelDataValidationPage;
