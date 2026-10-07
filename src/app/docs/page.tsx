import { redirect } from 'next/navigation';

/**
 * Redirects /docs to the static Swagger UI page in /public.
 */
export default function DocsPage() {
  redirect('/swagger.html');
}
