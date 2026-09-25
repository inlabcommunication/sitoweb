export const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cliente";

export const getClientId = (client: any, index = 0) => {
  const explicit = client?.id || client?.slug;
  if (explicit) return slugify(String(explicit));
  return slugify(client?.name || `cliente-${index + 1}`);
};

export const normalizeClients = (items: any[] = []) =>
  items.map((client, index) => ({
    ...client,
    id: getClientId(client, index),
    services: Array.isArray(client?.services)
      ? client.services
      : typeof client?.services === "string"
        ? client.services.split(",").map((item: string) => item.trim()).filter(Boolean)
        : [],
    results: Array.isArray(client?.results)
      ? client.results
      : typeof client?.results === "string"
        ? client.results.split("\n").map((item: string) => item.trim()).filter(Boolean)
        : [],
    gallery: Array.isArray(client?.gallery) ? client.gallery.filter(Boolean) : [],
  }));
