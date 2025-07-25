// app/api/autores/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`SELECT * FROM autores ORDER BY nombre`;
	return NextResponse.json(result);
}

export async function POST(req) {
	const body = await req.json();
	const { nombre } = body;

	if (!nombre) {
		return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
	}

	try {
		const result = await sql`
      INSERT INTO autores (nombre)
      VALUES (${nombre})
      RETURNING *`;
		return NextResponse.json(result[0]);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
