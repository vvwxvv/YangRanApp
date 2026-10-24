export function createApiResource(resourcePath, { idParam = 'id' } = {}) {
    const base = `/api/${resourcePath}`;
    const buildQuery = (id) => `${base}?${idParam}=${id}`;
  
    return {
      endpoints: {
        list: base,
        create: base,
        update: buildQuery,
        delete: buildQuery,
        detail: (id) => `${base}/${id}`,
      },
      methods: { create: 'POST', update: 'PUT', delete: 'DELETE' },
  
      async list() {
        const res = await fetch(base, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch ${resourcePath} (${res.status})`);
        const json = await res.json();
        return Array.isArray(json) ? json : json?.data ?? [];
      },
    };
  }