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
      mb.start_time AT TIME ZONE 'America/Argentina/Buenos_Aires' AS start_time,
      mb.end_time AT TIME ZONE 'America/Argentina/Buenos_Aires' AS end_time,
      COALESCE(json_agg(o.nombre) FILTER (WHERE o.id IS NOT NULL), '[]') AS obras
    FROM midi_blocks mb
    LEFT JOIN bloques_obras bo ON mb.id = bo.bloque_id
    LEFT JOIN obras o ON bo.obra_id = o.id
    GROUP BY mb.id
	ORDER BY start_time
  `;

	// Obtener lista única de obras
	const todasLasObras = new Set();
	bloques.forEach((b) => b.obras.forEach((o) => todasLasObras.add(o)));

	// Agrupar minutos por día y obra
	const porDia = {};

	for (const bloque of bloques) {
		const start = new Date(bloque.start_time);
		const end = new Date(bloque.end_time);
		const duracionMin = (end - start) / 60000;

		const obras = bloque.obras;
		const diaLocal = start.toLocaleDateString("es-AR", {
			timeZone: "America/Argentina/Buenos_Aires",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
		const [day, month, year] = diaLocal.split("/");
		const dia = `${year}-${month}-${day}`;

		if (!porDia[dia]) porDia[dia] = {};

		const minutosPorObra = duracionMin / obras.length;

		for (const obra of obras) {
			if (!porDia[dia][obra]) porDia[dia][obra] = 0;
			porDia[dia][obra] += minutosPorObra;
		}
	}

	// Asegurar todos los días y todas las obras, aunque sea 0
	const ultimosDias = getUltimosNDias(14);
	const resultado = ultimosDias.map((dia) => {
		const fila = { dia };
		for (const obra of todasLasObras) {
			fila[obra] = porDia[dia]?.[obra] ? Number(porDia[dia][obra].toFixed(1)) : 0;
		}
		return fila;
	});

	return NextResponse.json(resultado);
}
