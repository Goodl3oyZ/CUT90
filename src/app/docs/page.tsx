'use client';

import { useEffect, useRef } from 'react';

export const dynamic = 'force-dynamic';

/**
 * Swagger UI page served at /docs.
 * Loads swagger-ui from CDN and points it at /openapi.json.
 */
export default function DocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load Swagger UI CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css';
    document.head.appendChild(link);

    // Load Swagger UI JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js';
    script.onload = () => {
      // @ts-expect-error SwaggerUIBundle is loaded from CDN
      window.SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          // @ts-expect-error SwaggerUIBundle loaded from CDN
          window.SwaggerUIBundle.presets.apis,
        ],
        layout: 'BaseLayout',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: false,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount (unlikely in production)
      link.remove();
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Override Swagger UI theme to match Cut 90 branding */
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { font-family: var(--font-barlow-condensed), sans-serif; }
        .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2563eb; }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #059669; }
        .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #d97706; }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626; }
        .swagger-ui .btn.execute { background: #2563eb; border-color: #2563eb; }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← กลับหน้าหลัก
        </a>
      </div>
      <div id="swagger-ui" ref={containerRef} />
    </div>
  );
}
