// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
    SELECT 
      mb.*, 
      COALESCE(json_agg(json_build_object('id', o.id, 'nombre', o.nombre)) FILTER (WHERE o.id IS NOT NULL), '[]') AS obras
    FROM midi_blocks mb
    LEFT JOIN bloques_obras bo ON mb.id = bo.bloque_id
    LEFT JOIN obras o ON bo.obra_id = o.id
    GROUP BY mb.id
    ORDER BY mb.start_time DESC
  `;
	result.forEach((row) => {
		row.start_time = row.start_time.toISOString();
		row.end_time = row.end_time.toISOString();
	});
	return NextResponse.json(result);
}

export async function POST(req) {
	const body = await req.json();
	const { bloqueId, obraIds } = body;

	if (!bloqueId || !Array.isArray(obraIds)) {
		return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
	}

	try {
		await sql`DELETE FROM bloques_obras WHERE bloque_id = ${bloqueId}`;
		for (const obraId of obraIds) {
			await sql`INSERT INTO bloques_obras (bloque_id, obra_id) VALUES (${bloqueId}, ${obraId})`;
		}
		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
