// app/api/minutos_por_dia/route.js

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	try {
		const sql = neon(process.env.DATABASE_URL);

		const data = await sql`
      SELECT
        DATE(start_time) AS dia,
        COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60), 0) AS minutos
      FROM bloques
      GROUP BY dia
      ORDER BY dia ASC
    `;

		// 👇 Nos aseguramos que dia sea string YYYY-MM-DD
		const formatted = data.map((row) => ({
			dia: row.dia.toISOString().slice(0, 10),
			minutos: Number(row.minutos),
		}));

		return NextResponse.json(formatted);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error obteniendo minutos por día" }, { status: 500 });
	}
}
