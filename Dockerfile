FROM ghcr.io/puppeteer/puppeteer:25.16.0

ENV OPENCHATCUT_RUNTIME_PROFILE=shared
ENV PORT=5199
ENV NODE_ENV=production
ENV XDG_CONFIG_HOME=/tmp/.chromium
ENV XDG_CACHE_HOME=/tmp/.chromium

USER root
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run sync:mediapipe \
  && npm run sync:whisper-cli \
  && npm run generate:server-tool-catalog

EXPOSE 5199
CMD ["npm","run","dev","--","--host","0.0.0.0"]
