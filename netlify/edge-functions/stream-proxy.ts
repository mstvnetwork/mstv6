export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  
  // This takes everything after /proxy-stream/ and attaches it to Cloudfront
  const path = url.pathname.replace("/proxy-stream/", "");
  const targetUrl = `https://d1g8wgjurz8via.cloudfront.net{path}${url.search}`;

  console.log(`Proxying request to: ${targetUrl}`);

  const response = await fetch(targetUrl, {
    headers: {
      "accept": "*/*",
      "origin": "https://southlive.net",
      "referer": "https://southlive.net",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
    },
  });

  // Critical: Copy the response and add CORS so your browser allows the data through
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("Access-Control-Allow-Headers", "*");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
};
