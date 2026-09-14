/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Only public anonymous keys are allowed in client bundles
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
