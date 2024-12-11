import { inspectionsApi, pipelineApi } from "@/utils/server/backend";

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
      console.log(
        "Analyze response:",
        JSON.stringify(analyzeResponse.data, null, 2),
      );
      return inspectionsApi.postInspectionInspectionsPost(
        analyzeResponse.data,
        files,
        {
          headers: { Authorization: authHeader },
        },
      );
    })
    .then((inspectionsResponse) => {
      return Response.json(inspectionsResponse.data);
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          "Error response:",
          JSON.stringify(error.response.data, null, 2),
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    });
}
