export default async (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname.replace("/proxy-stream/", "");
  const targetUrl = "https://d1g8wgjurz8via.cloudfront.net" + path + url.search;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "origin": "https://southlive.net",
        "referer": "https://southlive.net",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    // Clone headers and force CORS and correct Content-Type
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    
    // If it's a manifest, ensure it's served as DASH XML
    if (path.endsWith(".mpd")) {
      newHeaders.set("Content-Type", "application/dash+xml");
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (err) {
    return new Response("Edge Fetch Error", { status: 500 });
  }
};
