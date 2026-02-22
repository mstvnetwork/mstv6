export default async (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname.replace("/proxy-stream/", "");
  
  // Use a simple string concatenation to avoid any backtick/template literal issues
  const targetUrl = "https://d1g8wgjurz8via.cloudfront.net" + path + url.search;

  const response = await fetch(targetUrl, {
    headers: {
      "accept": "*/*",
      "origin": "https://southlive.net",
      "referer": "https://southlive.net",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "*");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
};
