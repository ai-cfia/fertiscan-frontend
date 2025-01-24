import { handleApiError } from "@/utils/server/apiErrors";
import { MISSING_AUTH_RESPONSE } from "@/utils/server/apiResponses";
import { pipelineApi } from "@/utils/server/backend";
import { mapLabelDataOutputToLabelData } from "@/utils/server/modelTransformation";

export async function POST(request: Request) {
  const formData = await request.formData();
  console.debug("request body (formdata):", formData);
  const files = formData.getAll("files") as File[];

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  return pipelineApi
    .analyzeDocumentAnalyzePost(files)
    .then((analyzeResponse) => {
      const labelData = mapLabelDataOutputToLabelData(analyzeResponse.data);
      console.debug("response:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
