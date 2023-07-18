/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URI: string,
  readonly VITE_API_HTTP: string,
  readonly VITE_API_WS: string,
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}