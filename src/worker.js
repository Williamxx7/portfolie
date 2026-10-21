export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const oldHosts = new Set([
      "portfolio.williamlarsen.dk",
      "www.williamlarsen.dk"
    ]);

    if (oldHosts.has(url.hostname)) {
      const target = new URL(request.url);
      target.protocol = "https:";
      target.hostname = "williamlarsen.dk";
      return Response.redirect(target.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  }
};
