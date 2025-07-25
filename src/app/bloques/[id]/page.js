// app/bloques/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditarBloque() {
	const params = useParams();
	const router = useRouter();
	const bloqueId = parseInt(params.id);

	const [bloque, setBloque] = useState(null);
	const [obras, setObras] = useState([]);
	const [seleccionadas, setSeleccionadas] = useState([]);

	useEffect(() => {
		fetch("/api/bloques")
			.then((res) => res.json())
			.then((bloques) => {
				const b = bloques.find((b) => b.id === bloqueId);
				if (!b) {
					alert("Bloque no encontrado");
					router.push("/");
				} else {
					setBloque(b);
					setSeleccionadas(b.obras.map((o) => o.id));
				}
			});

		fetch("/api/obras")
			.then((res) => res.json())
			.then(setObras);
	}, [bloqueId, router]);

	const handleGuardar = async () => {
		const res = await fetch("/api/bloques", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ bloqueId, obraIds: seleccionadas }),
		});

		if (res.ok) alert("✅ Obras guardadas");
		else alert("❌ Error al guardar obras");
	};

	if (!bloque) return <main className="p-6">Cargando...</main>;

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-2">Editar Obras del Bloque</h1>

			<div className="grid grid-cols-3 gap-6">
				<div>
					<strong>Inicio:</strong> {new Date(bloque.start_time).toLocaleString()}
					<br />
					<strong>Fin:</strong> {new Date(bloque.end_time).toLocaleString()}
					<br />
					<strong>Notas:</strong> {bloque.note_on_count}
				</div>

				<div className="col-span-2">
					<label className="block font-medium mb-1">Obras asignadas:</label>
					<select
						multiple
						value={seleccionadas}
						onChange={(e) => setSeleccionadas(Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value)))}
						className="w-full border p-2 rounded h-48"
					>
						{obras.map((obra) => (
							<option key={obra.id} value={obra.id}>
								{obra.nombre} — {obra.autor_nombre || "(Sin autor)"} — Nivel {obra.nivel}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<Link href="/obras/nueva" className="bg-green-700 text-white px-4 py-2 rounded">
					➕ Agregar nueva obra
				</Link>

				<button onClick={handleGuardar} className="bg-blue-600 text-white px-6 py-2 rounded">
					Guardar cambios
				</button>
			</div>
		</main>
	);
}
