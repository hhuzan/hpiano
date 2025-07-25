"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaAutorPage() {
	const [nombre, setNombre] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch("/api/autores", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre }),
		});

		if (res.ok) {
			alert("✅ Autor creado");
			router.push("/obras/nueva");
		} else {
			alert("❌ Error al crear autor");
		}
	};

	return (
		<main className="p-6 space-y-6 max-w-md mx-auto">
			<h1 className="text-2xl font-bold">➕ Nuevo Autor</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block font-medium">Nombre del autor:</label>
					<input
						type="text"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						required
						className="w-full border p-2 rounded"
					/>
				</div>
				<button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">
					Guardar autor
				</button>
			</form>
		</main>
	);
}
