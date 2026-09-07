import { checkAuth, unauthorized, jsonResponse, getAllRecords, saveAllRecords } from '../../_lib/utils.js';

// DELETE /api/records/:id -> elimina un registro
export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const records = await getAllRecords(env);
  const filtered = records.filter((r) => r.id !== params.id);

  if (filtered.length === records.length) {
    return jsonResponse({ error: 'Registro no encontrado.' }, 404);
  }

  await saveAllRecords(env, filtered);
  return jsonResponse({ ok: true });
}
