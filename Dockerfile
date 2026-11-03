FROM node:24-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV OPENCHATCUT_RUNTIME_PROFILE=shared
ENV PORT=5199

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg chromium ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run sync:mediapipe \
  && npm run sync:whisper-cli \
  && npm run generate:server-tool-catalog \
  && npm run build

ENV CC_BROWSER_EXECUTABLE=/usr/bin/chromium

EXPOSE 5199
CMD ["npm","run","dev","--","--host","0.0.0.0"]
