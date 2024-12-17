import { handleApiError } from "@/utils/server/apiErrors";
import { inspectionsApi } from "@/utils/server/backend";
import { validate } from "uuid";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
      },
    );
  }

  const id = (await params).id;
  if (!validate(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  return inspectionsApi
    .getInspectionInspectionsIdGet(id, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionResponse) => {
      return Response.json(inspectionResponse.data);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
