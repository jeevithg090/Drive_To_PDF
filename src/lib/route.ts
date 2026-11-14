/**
 * The app has a single page. Some static hosts rewrite every path to
 * index.html, so anything other than the base path renders a not-found view.
 */
export const isHomePath = (pathname: string, base = '/'): boolean => {
  const normalisedBase = base.endsWith('/') ? base : `${base}/`;
  return (
    pathname === normalisedBase ||
    pathname === normalisedBase.slice(0, -1) ||
    pathname === `${normalisedBase}index.html`
  );
};
