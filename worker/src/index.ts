export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // API route
    if (url.pathname === "/api/events") {
      return Response.json([
        {
          id: "rockwell-001",
          slug: "example-show",
          title: "Example Show",
          dateISO: "2026-02-14T20:00:00-06:00",
          posterUrl: "/posters/example.jpg",
          alcoholWristbandsRequired: true
        }
      ]);
    }

    // Static asset handling
    const res = await env.ASSETS.fetch(request);

    // SPA fallback
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
    }

    return res;
  }
};
