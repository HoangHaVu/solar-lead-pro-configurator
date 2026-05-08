import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'SolarConfig';
const BASE_URL = 'https://solarconfig.de';
const DEFAULT_DESCRIPTION =
  'Konfiguriere deine Solaranlage in 5 Minuten. Kostenlose Wirtschaftlichkeitsanalyse, regionale Förderungen und direktes Angebot vom zertifizierten Fachbetrieb.';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `Kostenloser PV-Konfigurator | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="de_DE" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
