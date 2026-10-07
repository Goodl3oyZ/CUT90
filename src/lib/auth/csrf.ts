export function validateCsrfOrigin(req: Request): boolean {
  // GET and HEAD requests do not mutate state
  if (req.method === 'GET' || req.method === 'HEAD') {
    return true;
  }

  const originHeader = req.headers.get('origin');
  const refererHeader = req.headers.get('referer');
  const hostHeader = req.headers.get('host');
  const appOrigin = process.env.APP_ORIGIN;

  if (appOrigin) {
    try {
      const expectedHost = new URL(appOrigin).host;
      if (originHeader) {
        const originHost = new URL(originHeader).host;
        return originHost === expectedHost;
      }
      if (refererHeader) {
        const refererHost = new URL(refererHeader).host;
        return refererHost === expectedHost;
      }
    } catch {
      return false;
    }
  }

  if (originHeader && hostHeader) {
    try {
      const originHost = new URL(originHeader).host;
      return originHost === hostHeader;
    } catch {
      return false;
    }
  }

  if (refererHeader && hostHeader) {
    try {
      const refererHost = new URL(refererHeader).host;
      return refererHost === hostHeader;
    } catch {
      return false;
    }
  }

  // Allow in test environment if headers not present
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  return false;
}
