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

  return usersApi.signupSignupPost({headers: { Authorization: authHeader }}).then((response) => {
    return Response.json(response.data);
  }).catch((error) => {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status,
    });
  });
}
