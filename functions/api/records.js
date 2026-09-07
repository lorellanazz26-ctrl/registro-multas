import { checkAuth, unauthorized, jsonResponse, getAllRecords, saveAllRecords, validateRecord } from '../_lib/utils.js';

// GET /api/records -> lista todos los registros
export async function onRequestGet(context) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const records = await getAllRecords(env);
  records.sort((a, b) => new Date(b.fechaReclamo) - new Date(a.fechaReclamo));
  return jsonResponse(records);
}

// POST /api/records -> agrega un registro nuevo
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'JSON inválido.' }, 400);
  }

  const error = validateRecord(body);
  if (error) return jsonResponse({ error }, 400);

  const record = {
    id: crypto.randomUUID(),
    pickeador: body.pickeador.trim(),
    embalador: body.embalador.trim(),
    dueno: body.dueno.trim(),
    numeroPedido: body.numeroPedido.trim(),
    fechaPedido: body.fechaPedido,
    fechaReclamo: body.fechaReclamo,
    detectadoEn: body.detectadoEn.trim(),
    createdAt: new Date().toISOString(),
  };

  const records = await getAllRecords(env);
  records.push(record);
  await saveAllRecords(env, records);

  return jsonResponse(record, 201);
}
