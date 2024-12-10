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
      console.log(
        "Analyze response:",
        JSON.stringify(analyzeResponse.data, null, 2),
      );
      return Response.json(analyzeResponse.data);
    })
    .catch((error) => {
      const { response, request, message } = error;

      if (response) {
        console.error(
          "Response not ok",
          "Error response:",
          JSON.stringify(response.data, null, 2),
        );
        return new Response(JSON.stringify({ error: message }), {
          status: response.status,
        });
      }

      if (request) {
        console.error("No response was received", "Error request:", request);
        return new Response(JSON.stringify({ error: "No HTTP response" }), {
          status: 500,
        });
      }

      console.error("Unexpected error", "Error message:", message);
      return new Response(JSON.stringify({ error: message }), { status: 500 });
    });
}
