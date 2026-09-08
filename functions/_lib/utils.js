// Utilidades compartidas por las funciones de la API.
// El nombre de la carpeta empieza con "_" para que Cloudflare Pages
// NO la trate como una ruta pública.

export function checkAuth(request, env) {
  const code = request.headers.get('X-Access-Code');
  return Boolean(code) && Boolean(env.ACCESS_CODE) && code === env.ACCESS_CODE;
}

export function unauthorized() {
  return jsonResponse({ error: 'Clave de acceso incorrecta o faltante.' }, 401);
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function getAllRecords(env) {
  const data = await env.RECORDS_KV.get('records', 'json');
  return data || [];
}

export async function saveAllRecords(env, records) {
  await env.RECORDS_KV.put('records', JSON.stringify(records));
}

const REQUIRED_FIELDS = [
  'pickeador',
  'embalador',
  'dueno',
  'numeroPedido',
  'fechaPedido',
  'fechaDespacho',
  'fechaReclamo',
  'detectadoEn',
  'tipoReclamo',
];

export function validateRecord(body) {
  for (const field of REQUIRED_FIELDS) {
    if (!body || typeof body[field] !== 'string' || body[field].trim() === '') {
      return `Falta el campo: ${field}`;
    }
  }
  if (!TIPOS_RECLAMO.includes(body.tipoReclamo)) {
    return 'Tipo de reclamo inválido.';
  }
  return null;
}

export const TIPOS_RECLAMO = [
  'Libros sucios',
  'Libros faltantes',
  'Libros cambiados',
  'Libros sobrantes',
];
