// app/api/minutos_por_dia_y_obra/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

function getUltimosNDias(n) {
	const dias = [];
	const hoy = new Date();
	for (let i = 0; i < n; i++) {
		const d = new Date(hoy);
		d.setDate(d.getDate() - i);
		dias.push(d.toISOString().split("T")[0]);
	}
	return dias.reverse();
}

export async function GET() {
	const bloques = await sql`
		SELECT
		dia,
		t.nombre,
		ROUND(SUM(duracion_min / total_obras)) AS minutos
		FROM (
		SELECT
			date_trunc('day', start_time AT TIME ZONE 'America/Argentina/Buenos_Aires')
				AT TIME ZONE 'America/Argentina/Buenos_Aires' AS dia,
			o.nombre,
			EXTRACT(EPOCH FROM (end_time - start_time)) / 60 AS duracion_min,
			COUNT(*) OVER (PARTITION BY mb.id) AS total_obras
		FROM midi_blocks mb
		LEFT JOIN bloques_obras bo ON mb.id = bo.bloque_id
		LEFT JOIN obras o ON bo.obra_id = o.id
		WHERE start_time AT TIME ZONE 'America/Argentina/Buenos_Aires' >= (CURRENT_DATE - INTERVAL '13 days')
		) t
		GROUP BY dia, t.nombre
		ORDER BY dia, t.nombre;
  `;

	const grouped = Object.values(
		bloques.reduce((acc, { dia, nombre, minutos }) => {
			if (!acc[dia]) {
				acc[dia] = { dia };
			}
			acc[dia][nombre] = Number(minutos);
			return acc;
		}, {})
	);

	return NextResponse.json(grouped);
}
