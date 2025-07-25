import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function PUT(request, { params }) {
	const { id } = await params;
	const { obra_id } = await request.json();

	try {
		const sql = neon(`${process.env.DATABASE_URL}`);
		const result = await sql`
      UPDATE midi_blocks SET obra_id = ${obra_id || null} WHERE id = ${id} RETURNING *
    `;
		if (result.length === 0) {
			return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 });
		}

		return NextResponse.json(result[0]);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
