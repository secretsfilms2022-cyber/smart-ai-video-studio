import { Container } from "@cloudflare/containers";

export class VideoEditorContainer extends Container {
  defaultPort = 5199;
  sleepAfter = "20m";
  envVars = {
    NODE_ENV: "production",
    OPENCHATCUT_RUNTIME_PROFILE: "shared",
    PORT: "5199"
  };

  async fetch(request: Request) {
    return this.containerFetch(request);
  }
}

interface Env {
  VIDEO_EDITOR: DurableObjectNamespace<VideoEditorContainer>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        service: "Smart Digital Studio AI Video Studio",
        backend: "OpenChatCut",
        runtime: "Cloudflare Container"
      });
    }

    const container = env.VIDEO_EDITOR.getByName("main");
    return container.fetch(request);
  }
};
