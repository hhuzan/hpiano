"use client";

import { useEffect, useState } from "react";

export default function NuevaObra() {
	const [nombre, setNombre] = useState("");
	const [nivel, setNivel] = useState(0);
	const [autorId, setAutorId] = useState("");
	const [autores, setAutores] = useState([]);
	const [obras, setObras] = useState([]);

	useEffect(() => {
		fetch("/api/autores")
			.then((res) => res.json())
			.then(setAutores);

		fetch("/api/obras")
			.then((res) => res.json())
			.then(setObras);
	}, []);

	const crearObra = async () => {
		const res = await fetch("/api/obras", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre, nivel, autorId: parseInt(autorId) }),
		});

		if (res.ok) {
			alert("✅ Obra creada");
			setNombre("");
			setNivel(0);
			setAutorId("");
			const nueva = await res.json();
			setObras((prev) => [...prev, nueva]);
		} else {
			alert("❌ Error al crear la obra");
		}
	};

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Agregar nueva obra</h1>

			<div className="mb-4 space-x-4">
				<a href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">
					⬅ Volver a bloques
				</a>

				<a href="/autores/nuevo" className="bg-blue-700 text-white px-4 py-2 rounded inline-block">
					➕ Agregar nuevo autor
				</a>
			</div>

			<div className="space-y-4 border p-4 rounded shadow">
				<div>
					<label className="block font-medium">Nombre:</label>
					<input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded" />
				</div>
				<div>
					<label className="block font-medium">Nivel (0–10):</label>
					<input
						type="number"
						min={0}
						max={10}
						value={nivel}
						onChange={(e) => setNivel(Number(e.target.value))}
						className="w-full border p-2 rounded"
					/>
				</div>
				<div>
					<label className="block font-medium">Autor:</label>
					<select value={autorId} onChange={(e) => setAutorId(e.target.value)} className="w-full border p-2 rounded">
						<option value="">Seleccione un autor</option>
						{autores.map((autor) => (
							<option key={autor.id} value={autor.id}>
								{autor.nombre}
							</option>
						))}
					</select>
				</div>
				<button onClick={crearObra} className="bg-green-600 text-white px-4 py-2 rounded">
					Guardar obra
				</button>
			</div>

			<div className="pt-6">
				<h2 className="text-xl font-semibold mb-2">Obras existentes</h2>
				<table className="min-w-full text-sm border border-gray-300 rounded overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-3 py-2 text-left border-b">Nombre</th>
							<th className="px-3 py-2 text-left border-b">Nivel</th>
							<th className="px-3 py-2 text-left border-b">Autor</th>
						</tr>
					</thead>
					<tbody>
						{obras.map((obra) => (
							<tr key={obra.id} className="border-t">
								<td className="px-3 py-2">{obra.nombre}</td>
								<td className="px-3 py-2">{obra.nivel}</td>
								<td className="px-3 py-2">{obra.autor_nombre || "(Sin autor)"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
}
