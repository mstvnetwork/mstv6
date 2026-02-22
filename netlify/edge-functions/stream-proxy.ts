export default async (request: Request) => {
  const url = new URL(request.url);
  // Get the target from the 'url' query parameter
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing 'url' parameter", { status: 400 });
  }

  console.log(`Proxying to: ${targetUrl}`);

  const response = await fetch(targetUrl, {
    headers: {
      "Origin": "https://southlive.net",
      "Referer": "https://southlive.net",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
};
