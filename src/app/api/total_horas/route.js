// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
   		select sum(end_time - start_time)
    	from midi_blocks`;
	return NextResponse.json(result);
}
