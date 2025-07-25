// app/api/obras/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
    SELECT obras.*, autores.nombre AS autor_nombre
    FROM obras
    LEFT JOIN autores ON obras.autor_id = autores.id
    ORDER BY obras.nombre`;
	return NextResponse.json(result);
}

export async function POST(req) {
	const body = await req.json();
	const { nombre, nivel, autorId } = body;

	if (!nombre || nivel === undefined || autorId === undefined) {
		return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
	}

	try {
		const result = await sql`
      INSERT INTO obras (nombre, nivel, autor_id)
      VALUES (${nombre}, ${nivel}, ${autorId})
      RETURNING *`;
		return NextResponse.json(result[0]);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
