// app/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MinutosPorDiaChart from "@/components/MinutosPorDiaChart";
import TiempoPorObraChart from "@/components/TiempoPorObraChart";
import MinutosPorDiaStackedChart from "@/components/MinutosPorDiaStackedChart";

export default function Home() {
	const [bloques, setBloques] = useState([]);

	useEffect(() => {
		fetch("/api/bloques")
			.then((res) => res.json())
			.then(setBloques);
	}, []);

	const totalHoras =
		bloques.reduce((acc, bloque) => {
			const inicio = new Date(bloque.start_time);
			const fin = new Date(bloque.end_time);
			const duracionMin = (fin - inicio) / 60000;
			return acc + duracionMin;
		}, 0) / 60;

	return (
		<main className="pt-4 pb-4">
			<h1 className="pl-8 text-2xl font-bold">Total: {totalHoras.toFixed(1)} h</h1>

			{bloques.length > 0 && <MinutosPorDiaChart bloques={bloques} />}

			<MinutosPorDiaStackedChart />

			<TiempoPorObraChart />

			{bloques.map((bloque) => (
				<div key={bloque.id} className="border p-4 space-y-2">
					<div className="flex justify-between text-sm ">
						<div className="w-2/3">
							<strong>
								{new Date(bloque.start_time).toLocaleString("es-AR", {
									weekday: "short",
									day: "2-digit",
									month: "2-digit",
									// year: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
							</strong>
						</div>
						<div className="w-1/6">
							<strong>{Math.round((new Date(bloque.end_time) - new Date(bloque.start_time)) / 60000)}m</strong>
						</div>
						<div className="w-1/6">
							<strong>({bloque.note_on_count})</strong>
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
