import { handleApiError } from "@/utils/server/apiErrors";
import { inspectionsApi } from "@/utils/server/backend";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const labelDataString = formData.get("labelData") as string;
  const labelData = JSON.parse(labelDataString);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
      },
    );
  }

  return inspectionsApi
    .postInspectionInspectionsPost(labelData, files, {
      headers: { Authorization: authHeader },
    })
    .then((inspectionsResponse) => {
      return Response.json(inspectionsResponse.data);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
