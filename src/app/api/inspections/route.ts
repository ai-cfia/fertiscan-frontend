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
