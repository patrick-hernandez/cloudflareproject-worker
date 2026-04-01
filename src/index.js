export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const email =
      request.headers.get("Cf-Access-Authenticated-User-Email") ||
      "unknown";

    const country = request.cf?.country || "UNKNOWN";
    const timestamp = new Date().toISOString();

    if (path === "/secure" || path === "/secure/") {
      return new Response(
        `<html>
          <body>
            <p>
              ${email} authenticated at ${timestamp} from
              <a href="/secure/${country}">${country}</a>
            </p>
          </body>
        </html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    const match = path.match(/^\/secure\/([A-Z]{2})$/);
    if (match) {
      const code = match[1];
      const object = await env.FLAGS.get(`flags/${code.toLowerCase()}.svg`);

      if (!object) {
        return new Response("Flag not found", { status: 404 });
      }

      return new Response(object.body, {
        headers: { "content-type": "image/svg+xml" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
