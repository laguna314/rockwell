import { Router } from "itty-router";

const router = Router();

router.get("/api/events", () => {
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
});

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return router.handle(request);
    }

    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
    }
    return res;
  }
};
