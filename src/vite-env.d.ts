/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HTTP_URL: string;
  readonly VITE_HTTP_UPLOAD: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
