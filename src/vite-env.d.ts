/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HTTP_URL: string;
  readonly VITE_HTTP_UPLOAD: string;
  // 更多环境变量...
}
declare const __VITE_ENV_DATE__: string;
declare const __VITE_ENV_VERSION__: string;
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
