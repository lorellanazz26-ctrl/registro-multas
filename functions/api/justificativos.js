import { checkAuth, unauthorized, jsonResponse } from '../_lib/utils.js';

// GET /api/justificativos -> lista los números de pedido que tienen justificativo
export async function onRequestGet(context) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const list = await env.RECORDS_KV.list({ prefix: 'justificativo:' });
  const numeros = list.keys.map((k) => k.name.replace('justificativo:', ''));
  return jsonResponse(numeros);
}

// POST /api/justificativos -> guarda (o reemplaza) el justificativo de un pedido
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'JSON inválido.' }, 400);
  }

  const numeroPedido = (body.numeroPedido || '').trim();
  const photo = body.photo || '';

  if (!numeroPedido) return jsonResponse({ error: 'Falta el número de pedido.' }, 400);
  if (!photo.startsWith('data:image/')) {
    return jsonResponse({ error: 'Falta la fotografía o el formato no es válido.' }, 400);
  }
  if (photo.length > 8_000_000) {
    return jsonResponse({ error: 'La imagen es muy pesada. Intenta con una foto más liviana.' }, 400);
  }

  const record = {
    numeroPedido,
    photo,
    createdAt: new Date().toISOString(),
  };

  await env.RECORDS_KV.put('justificativo:' + numeroPedido, JSON.stringify(record));
  return jsonResponse({ ok: true, numeroPedido }, 201);
}
