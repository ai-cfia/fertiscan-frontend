import { handleApiError } from "@/utils/server/apiErrors";
import { MISSING_AUTH_RESPONSE } from "@/utils/server/apiResponses";
import { inspectionsApi } from "@/utils/server/backend";
import {
  mapInspectionToLabelData,
  mapLabelDataToLabelDataInput,
} from "@/utils/server/modelTransformation";

export async function POST(request: Request) {
  const formData = await request.formData();
  console.debug("request body (formdata):", formData);
  const files = formData.getAll("files") as File[];
  const labelDataString = formData.get("labelData") as string;
  const labelData = JSON.parse(labelDataString);
  const LabelDataInput = mapLabelDataToLabelDataInput(labelData);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  return inspectionsApi
    .postInspectionInspectionsPost(LabelDataInput, files, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionsResponse) => {
      const labelData = mapInspectionToLabelData(inspectionsResponse.data);
      console.debug("response:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
