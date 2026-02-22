export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  // 1. Fetch the video data with "Fake" headers
  const response = await fetch(targetUrl, {
    headers: {
      "Referer": "https://tulnit.com",
      "Origin": "https://tulnit.com",
      "User-Agent": request.headers.get("user-agent"),
    },
  });

  // 2. Prepare the response to send back to your player
  const newHeaders = new Headers(response.headers);
  
  // 3. SECRECY: Add CORS headers so your browser allows the video to play
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config = { path: "/proxy" };

