"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
	const [bloques, setBloques] = useState([]);
	const [obras, setObras] = useState([]);
	const [nuevaObra, setNuevaObra] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			const resBloques = await fetch("/api/bloques");
			const bloquesData = await resBloques.json();
			setBloques(bloquesData);

			const resObras = await fetch("/api/obras");
			const obrasData = await resObras.json();
			setObras(obrasData);

			setLoading(false);
		}
		fetchData();
	}, []);

	const crearObra = async () => {
		if (!nuevaObra.trim()) return;
		const res = await fetch("/api/obras", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre: nuevaObra }),
		});
		const obraCreada = await res.json();
		setObras([...obras, obraCreada]);
		setNuevaObra("");
	};

	const asignarObra = async (bloqueId, obraId) => {
		await fetch(`/api/bloques/${bloqueId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ obra_id: obraId }),
		});

		setBloques(bloques.map((b) => (b.id === bloqueId ? { ...b, obra_id: obraId } : b)));
	};

	if (loading) return <div>Cargando...</div>;

	return (
		<div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
			<h1>Bloques MIDI</h1>

			<div>
				<h2>Crear nueva obra</h2>
				<input value={nuevaObra} onChange={(e) => setNuevaObra(e.target.value)} placeholder="Nombre de la obra" />
				<button onClick={crearObra}>Crear</button>
			</div>

			<hr />

			<div>
				{bloques.map((bloque) => (
					<div
						key={bloque.id}
						style={{
							padding: 10,
							marginBottom: 10,
							border: "1px solid #ccc",
							borderRadius: 4,
						}}
					>
						<div>
							<strong>
								{new Date(bloque.start_time).toLocaleString()} - {new Date(bloque.end_time).toLocaleString()}
							</strong>
						</div>
						<div>Note On count: {bloque.note_on_count}</div>

						<div>
							<label>Obra: </label>
							<select value={bloque.obra_id || ""} onChange={(e) => asignarObra(bloque.id, e.target.value || null)}>
								<option value="">Sin asignar</option>
								{obras.map((obra) => (
									<option key={obra.id} value={obra.id}>
										{obra.nombre}
									</option>
								))}
							</select>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
