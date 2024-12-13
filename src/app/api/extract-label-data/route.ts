import { handleApiError } from "@/utils/server/apiErrors";
import { pipelineApi } from "@/utils/server/backend";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
      },
    );
  }

  return pipelineApi
    .analyzeDocumentAnalyzePost(files)
    .then((analyzeResponse) => {
      return Response.json(analyzeResponse.data);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
