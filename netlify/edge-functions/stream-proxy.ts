export default async (request: Request) => {
  const url = new URL(request.url);
  
  // 1. Extract the path (e.g., bpk-tv/Zeetv/default/main.mpd)
  const path = url.pathname.replace("/proxy-stream/", "");
  
  // 2. Build the Target URL - MAKE SURE TO USE BACKTICKS ` 
  const targetUrl = `https://d1g8wgjurz8via.cloudfront.net{path}${url.search}`;

  console.log(`[Proxy Request]: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "origin": "https://southlive.net",
        "referer": "https://southlive.net",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
      },
    });

    // 3. Clone and add CORS headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

  } catch (err) {
    console.error("Fetch Error:", err.message);
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
};
