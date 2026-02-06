import { Helmet } from "react-helmet-async";
import { env } from "@/app/config/env";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  imageUrl?: string;
  noIndex?: boolean;
};

const fallbackDescription =
  "Nursing Educator Hub offers exam prep, MCQs, and study resources for nursing students.";

export default function Seo({
  title,
  description = fallbackDescription,
  canonicalPath,
  imageUrl,
  noIndex = false,
}: SeoProps) {
  const siteUrl =
    env.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const canonical = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;
  const image = imageUrl ? `${siteUrl}${imageUrl}` : `${siteUrl}/images/logo.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
