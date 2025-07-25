"use client";

import { useState, useEffect } from "react";

export default function NuevaObra() {
	const [nombre, setNombre] = useState("");
	const [nivel, setNivel] = useState(0);
	const [autorId, setAutorId] = useState("");
	const [obras, setObras] = useState([]);
	const [autores, setAutores] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Cargar autores y obras
	useEffect(() => {
		fetch("/api/autores")
			.then((res) => res.json())
			.then(setAutores);

		fetch("/api/obras")
			.then((res) => res.json())
			.then(setObras);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!nombre.trim()) {
			setError("El nombre es obligatorio");
			return;
		}
		if (nivel < 0 || nivel > 10) {
			setError("El nivel debe estar entre 0 y 10");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/obras", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nombre,
					nivel: Number(nivel),
					autorId: autorId || null,
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Error al crear obra");
			} else {
				const nuevaObra = await res.json();
				setObras((prev) => [nuevaObra, ...prev]);
				setNombre("");
				setNivel(0);
				setAutorId("");
			}
		} catch (err) {
			setError("Error de conexión");
		}

		setLoading(false);
	};

	return (
		<main className="p-6 max-w-3xl mx-auto">
			<div className="mb-6 flex gap-4">
				<a href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">
					⬅ Volver a bloques
				</a>
				<a href="/autores/nuevo" className="bg-blue-700 text-white px-4 py-2 rounded inline-block">
					➕ Agregar nuevo autor
				</a>
			</div>

			<h1 className="text-2xl font-bold mb-4">Nueva Obra</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block font-medium mb-1" htmlFor="nombre">
						Nombre
					</label>
					<input
						id="nombre"
						type="text"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						className="border rounded px-3 py-2 w-full"
						required
					/>
				</div>

				<div>
					<label className="block font-medium mb-1" htmlFor="nivel">
						Nivel (0-10)
					</label>
					<input
						id="nivel"
						type="number"
						min={0}
						max={10}
						value={nivel}
						onChange={(e) => setNivel(e.target.value)}
						className="border rounded px-3 py-2 w-full"
						required
					/>
				</div>

				<div>
					<label className="block font-medium mb-1" htmlFor="autor">
						Autor
					</label>
					<select
						id="autor"
						value={autorId}
						onChange={(e) => setAutorId(e.target.value)}
						className="border rounded px-3 py-2 w-full"
					>
						<option value="">(Sin autor)</option>
						{autores.map((autor) => (
							<option key={autor.id} value={autor.id}>
								{autor.nombre}
							</option>
						))}
					</select>
				</div>

				{error && <p className="text-red-600">{error}</p>}

				<button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50">
					{loading ? "Guardando..." : "Crear obra"}
				</button>
			</form>

			<section className="pt-6">
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
			</section>
		</main>
	);
}
