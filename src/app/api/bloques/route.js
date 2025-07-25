import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	const sql = neon(`${process.env.DATABASE_URL}`);
	const result = await sql`
	    SELECT midi_blocks.*, obras.nombre AS obra_nombre
	    FROM midi_blocks
	    LEFT JOIN obras ON midi_blocks.obra_id = obras.id
	    ORDER BY midi_blocks.start_time DESC
	  `;
	return NextResponse.json(result);
}
