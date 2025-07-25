// app/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [bloques, setBloques] = useState([]);
	const [obras, setObras] = useState([]);
	const [asignaciones, setAsignaciones] = useState({});

	useEffect(() => {
		fetch("/api/bloques")
			.then((res) => res.json())
			.then((data) => {
				setBloques(data);
				const initial = {};
				data.forEach((b) => {
					initial[b.id] = b.obras.map((o) => o.id);
				});
				setAsignaciones(initial);
			});

		fetch("/api/obras")
			.then((res) => res.json())
			.then(setObras);
	}, []);

	const handleSelectChange = (bloqueId, obraIds) => {
		setAsignaciones((prev) => ({ ...prev, [bloqueId]: obraIds }));
	};

	const guardarAsignacion = async (bloqueId) => {
		const res = await fetch("/api/bloques", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ bloqueId, obraIds: asignaciones[bloqueId] }),
		});

		if (res.ok) alert("✅ Guardado");
		else alert("❌ Error al guardar");
	};

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Bloques MIDI</h1>

			<div className="mb-4">
				<Link href="/obras/nueva" className="bg-green-700 text-white px-4 py-2 rounded inline-block">
					➕ Agregar nueva obra
				</Link>
			</div>

			{bloques.map((bloque) => (
				<div key={bloque.id} className="border rounded p-4 space-y-2 shadow">
					<div className="flex justify-between gap-4 text-sm text-gray-500">
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
						<select
							multiple
							value={asignaciones[bloque.id] || []}
							onChange={(e) =>
								handleSelectChange(
									bloque.id,
									Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value))
								)
							}
							className="w-full border p-2 rounded"
						>
							{obras.map((obra) => (
								<option key={obra.id} value={obra.id}>
									{obra.nombre}
								</option>
							))}
						</select>
						<button onClick={() => guardarAsignacion(bloque.id)} className="bg-blue-600 text-white px-4 py-1 rounded">
							💾
						</button>
					</div>
				</div>
			))}
		</main>
	);
}
