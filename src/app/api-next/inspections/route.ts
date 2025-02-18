import { handleApiError } from "@/utils/server/apiErrors";
import { MISSING_AUTH_RESPONSE } from "@/utils/server/apiResponses";
import { inspectionsApi } from "@/utils/server/backend";
import {
  mapInspectionToLabelData,
  mapLabelDataToBackendLabelData,
} from "@/utils/server/modelTransformation";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  const formData = await request.formData();
  console.debug("[post inspections] request body (formdata):", formData);
  const files = formData.getAll("files") as File[];
  const labelDataString = formData.get("labelData") as string;
  const labelData = JSON.parse(labelDataString);
  const labelDataInput = mapLabelDataToBackendLabelData(labelData);
  console.debug("[post inspections] sent labelDataInput:", labelDataInput);

  return inspectionsApi
    .postInspectionInspectionsPost(labelDataInput, files, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionsResponse) => {
      console.debug(
        "[post inspections] response data:",
        inspectionsResponse.data,
      );
      const labelData = mapInspectionToLabelData(inspectionsResponse.data);
      console.debug("[post inspections] returned labelData:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  return inspectionsApi
    .getInspectionsInspectionsGet({
      headers: { Authorization: authHeader },
    })
    .then((inspectionsResponse) => {
      return Response.json(inspectionsResponse.data);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
