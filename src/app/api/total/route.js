// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
   		SELECT COUNT (DISTINCT date_trunc('day', start_time AT TIME ZONE 'America/Argentina/Buenos_Aires')) AS dias,
   			SUM(end_time - start_time) AS tiempo,
   			SUM(note_on_count) AS notas
    	FROM midi_blocks`;
	return NextResponse.json(result);
}
