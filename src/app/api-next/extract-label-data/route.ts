import { handleApiError } from "@/utils/server/apiErrors";
import { MISSING_AUTH_RESPONSE } from "@/utils/server/apiResponses";
import { pipelineApi } from "@/utils/server/backend";
import { mapBackendLabelDataToLabelData } from "@/utils/server/modelTransformation";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  const formData = await request.formData();
  console.debug("[post extract-label-data] request body (formdata):", formData);
  const files = formData.getAll("files") as File[];

  return pipelineApi
    .analyzeDocumentAnalyzePost(files, {
      headers: { Authorization: authHeader },
    })
    .then((analyzeResponse) => {
      console.debug(
        "[post extract-label-data] response data:",
        analyzeResponse.data,
      );
      const labelData = mapBackendLabelDataToLabelData(analyzeResponse.data);
      console.debug("[post extract-label-data] returned labelData:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
