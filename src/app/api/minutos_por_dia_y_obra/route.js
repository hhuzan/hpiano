import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
	const rows = await sql`
WITH dias AS (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '13 days',
    CURRENT_DATE,
    INTERVAL '1 day'
  )::date AS dia
),

bloques_base AS (
  SELECT
    mb.id,
    date_trunc(
      'day',
      mb.start_time AT TIME ZONE 'America/Argentina/Buenos_Aires'
    )::date AS dia,
    EXTRACT(EPOCH FROM (mb.end_time - mb.start_time)) / 60 AS duracion_min
  FROM midi_blocks mb
  WHERE mb.start_time >= (CURRENT_DATE - INTERVAL '13 days')
),

bloques_con_obras AS (
  SELECT
    bb.id,
    bb.dia,
    COALESCE(o.nombre, '???') AS nombre,
    bb.duracion_min,
    COUNT(o.id) OVER (PARTITION BY bb.id) AS total_obras
  FROM bloques_base bb
  LEFT JOIN bloques_obras bo ON bb.id = bo.bloque_id
  LEFT JOIN obras o ON bo.obra_id = o.id
),

minutos_por_dia_obra AS (
  SELECT
    dia,
    nombre,
    ROUND(SUM(
      CASE 
        WHEN total_obras > 0 THEN duracion_min / total_obras
        ELSE duracion_min
      END
    )) AS minutos
  FROM bloques_con_obras
  GROUP BY dia, nombre
)

SELECT
  d.dia,
  m.nombre,
  m.minutos
FROM dias d
LEFT JOIN minutos_por_dia_obra m 
  ON d.dia = m.dia
ORDER BY d.dia, m.nombre;
  `;

	// 🔹 Agrupar en formato que espera Recharts
	const grouped = {};

	rows.forEach(({ dia, nombre, minutos }) => {
		if (!grouped[dia]) {
			grouped[dia] = { dia };
		}

		if (nombre !== null) {
			grouped[dia][nombre] = Number(minutos);
		}
	});

	return NextResponse.json(Object.values(grouped));
}
