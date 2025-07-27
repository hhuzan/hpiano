// app/api/tiempo_por_obra/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	const sql = neon(process.env.DATABASE_URL);

	const result = await sql`
    SELECT 
      o.nombre AS obra,
      SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / bo.total_obras / 60) AS minutos
    FROM midi_blocks b
    JOIN (
      SELECT bloque_id, COUNT(*) AS total_obras
      FROM bloques_obras
      GROUP BY bloque_id
    ) bo ON bo.bloque_id = b.id
    JOIN bloques_obras bo2 ON bo2.bloque_id = b.id
    JOIN obras o ON o.id = bo2.obra_id
    GROUP BY o.nombre
    ORDER BY minutos DESC
  `;

	return NextResponse.json(result);
}
