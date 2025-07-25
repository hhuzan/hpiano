import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	const sql = neon(`${process.env.DATABASE_URL}`);
	const result = await sql`SELECT * FROM obras ORDER BY nombre`;
	return NextResponse.json(result);
}

export async function POST(request) {
	const { nombre } = await request.json();

	if (!nombre || nombre.trim() === "") {
		return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
	}

	const sql = neon(`${process.env.DATABASE_URL}`);
	const insert = await sql`INSERT INTO obras (nombre) VALUES (${nombre.trim()}) RETURNING *`;
	console.log(insert);
	return NextResponse.json(insert[0], { status: 201 });
}
