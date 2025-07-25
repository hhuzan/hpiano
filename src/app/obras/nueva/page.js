"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaObraPage() {
	const [nombre, setNombre] = useState("");
	const [mensaje, setMensaje] = useState("");
	const router = useRouter();

	const crearObra = async () => {
		if (!nombre.trim()) return setMensaje("⚠️ Ingresá un nombre válido");
		const res = await fetch("/api/obras", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre }),
		});
		if (res.ok) {
			setMensaje("✅ Obra creada");
			setTimeout(() => router.push("/"), 1000);
		} else {
			setMensaje("❌ Error al crear obra");
		}
	};

	return (
		<main className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Nueva Obra</h1>
			<input
				type="text"
				placeholder="Nombre de la obra"
				value={nombre}
				onChange={(e) => setNombre(e.target.value)}
				className="border p-2 rounded w-full"
			/>
			<button onClick={crearObra} className="bg-green-600 text-white px-4 py-2 rounded">
				Crear
			</button>
			{mensaje && <p>{mensaje}</p>}
		</main>
	);
}
