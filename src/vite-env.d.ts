/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_SENDER_ID: string;
    readonly VITE_APP_ID: string;
    readonly VITE_MEASUREMENT_ID: string;
    readonly VITE_NHL_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }