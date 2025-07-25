// app/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MinutosPorDiaChart from "@/components/MinutosPorDiaChart";

export default function Home() {
	const [bloques, setBloques] = useState([]);

	useEffect(() => {
		fetch("/api/bloques")
			.then((res) => res.json())
			.then(setBloques);
	}, []);

	return (
		<main className="p-6">
			{/* <h1 className="text-2xl font-bold">Bloques MIDI</h1> */}

			{bloques.length > 0 && <MinutosPorDiaChart bloques={bloques} />}

			{bloques.map((bloque) => (
				<div key={bloque.id} className="border p-4 space-y-2">
					<div className="flex justify-between text-sm ">
						<div className="w-1/3">
							<strong>{new Date(bloque.start_time).toLocaleString()}</strong>
						</div>
						<div className="w-1/3">
							<strong>{Math.round((new Date(bloque.end_time) - new Date(bloque.start_time)) / 60000)} min</strong>
						</div>
						<div className="w-1/3">
							<strong>{bloque.note_on_count} Notas</strong>
						</div>
					</div>
					<div className="flex gap-4">
						<ul className="list-disc list-inside w-full">
							{bloque.obras.map((obra) => (
								<li key={obra.id}>{obra.nombre}</li>
							))}
						</ul>
						<div className="content-center">
							<Link href={`/bloques/${bloque.id}`}>💾</Link>
						</div>
					</div>
				</div>
			))}
		</main>
	);
}
