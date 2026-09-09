import { checkAuth, unauthorized, jsonResponse } from '../../_lib/utils.js';

// GET /api/justificativos/:numeroPedido -> devuelve el justificativo completo (incluye la foto)
export async function onRequestGet(context) {
  const { request, env, params } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const data = await env.RECORDS_KV.get('justificativo:' + params.numeroPedido, 'json');
  if (!data) return jsonResponse({ error: 'No hay justificativo para ese pedido.' }, 404);
  return jsonResponse(data);
}

// DELETE /api/justificativos/:numeroPedido -> elimina el justificativo
export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!checkAuth(request, env)) return unauthorized();

  await env.RECORDS_KV.delete('justificativo:' + params.numeroPedido);
  return jsonResponse({ ok: true });
}
