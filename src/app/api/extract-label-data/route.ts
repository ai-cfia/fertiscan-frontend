import { BACKEND_URL } from "@/utils/server/constants";
import axios from "axios";

export async function POST(request: Request) {
  const formData = await request.formData();

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
      },
    );
  }

  return axios
    .post(`${BACKEND_URL}/analyze`, formData, {
      headers: { Authorization: authHeader },
    })
    .then((analyzeResponse) => {
      formData.set("label_data", JSON.stringify(analyzeResponse.data));

      return axios.post(`${BACKEND_URL}/inspections`, formData, {
        headers: { Authorization: authHeader },
      });
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
