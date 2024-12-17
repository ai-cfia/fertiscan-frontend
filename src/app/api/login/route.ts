import { handleApiError } from "@/utils/server/apiErrors";
import { usersApi } from "@/utils/server/backend";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
      },
    );
  }

  return usersApi
    .loginLoginPost({ headers: { Authorization: authHeader } })
    .then((response) => {
      return Response.json(response.data);
    })
    .catch((error) => {
      return handleApiError(error);
    });
}
