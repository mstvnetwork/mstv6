export default async (request: Request) => {
  const url = new URL(request.url);
  
  // 1. Extract the path (e.g., bpk-tv/Zeetv/default/main.mpd)
  const path = url.pathname.replace("/proxy-stream/", "");
  
  // 2. Build the Target URL
  const targetUrl = `https://d1g8wgjurz8via.cloudfront.net{path}${url.search}`;

  // 3. Define the spoofed headers
  const spoofedHeaders = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "origin": "https://southlive.net",
    "referer": "https://southlive.net",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
  };

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: spoofedHeaders,
    });

    // 4. Create a clean response with CORS headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "*");

    // Return the response to the browser
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

  } catch (error) {
    console.error("Proxy Fetch Error:", error);
    return new Response(`Edge Function Error: ${error.message}`, { status: 500 });
  }
};
