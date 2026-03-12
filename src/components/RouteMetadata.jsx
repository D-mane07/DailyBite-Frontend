import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_METADATA, getRouteMetadata } from "../seo/routeMetadata";

const upsertMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertLinkTag = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
};

const toAbsoluteUrl = (pathOrUrl) => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${window.location.origin}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
};

const RouteMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    const metadata = getRouteMetadata(location.pathname);
    const title = metadata.title || DEFAULT_METADATA.title;
    const description = metadata.description || DEFAULT_METADATA.description;
    const robots = metadata.robots || DEFAULT_METADATA.robots;
    const image = toAbsoluteUrl(metadata.image || DEFAULT_METADATA.image);
    const canonical = `${window.location.origin}${location.pathname}${location.search}`;

    document.title = title;

    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", robots);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", title);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", image);

    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:site_name", "Vingo");
    upsertMetaTag("property", "og:title", title);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:url", canonical);
    upsertMetaTag("property", "og:image", image);

    upsertLinkTag("canonical", canonical);
  }, [location.pathname, location.search]);

  return null;
};

export default RouteMetadata;
