import { handleApiError } from "@/utils/server/apiErrors";
import {
  INVALID_ID_RESPONSE,
  MISSING_AUTH_RESPONSE,
} from "@/utils/server/apiResponses";
import { inspectionsApi } from "@/utils/server/backend";
import {
  mapInspectionToLabelData,
  mapLabelDataToInspectionUpdate,
} from "@/utils/server/modelTransformation";
import { validate } from "uuid";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  const id = (await params).id;
  if (!validate(id)) {
    return INVALID_ID_RESPONSE;
  }

  return inspectionsApi
    .getInspectionInspectionsIdGet(id, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionResponse) => {
      const labelData = mapInspectionToLabelData(inspectionResponse.data);
      console.debug("response:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return MISSING_AUTH_RESPONSE;
  }

  const id = (await params).id;
  if (!validate(id)) {
    return INVALID_ID_RESPONSE;
  }
  const body = await request.json();
  console.debug("request body:", body);
  const inspectionUpdate = mapLabelDataToInspectionUpdate(body);
  return inspectionsApi
    .putInspectionInspectionsIdPut(id, inspectionUpdate, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionResponse) => {
      const labelData = mapInspectionToLabelData(inspectionResponse.data);
      console.debug("response:", labelData);
      return Response.json(labelData);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
