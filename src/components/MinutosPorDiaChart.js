"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function MinutosPorDiaChart({ bloques }) {
	const duracionPorDia = {};

	bloques.forEach((bloque) => {
		const start = new Date(bloque.start_time);
		const end = new Date(bloque.end_time);
		const fecha = start.toLocaleDateString("sv-SE", {
			timeZone: "America/Argentina/Buenos_Aires",
		});
		const minutos = (end - start) / 1000 / 60;
		duracionPorDia[fecha] = (duracionPorDia[fecha] || 0) + minutos;
	});

	const fechas = Object.keys(duracionPorDia).sort();
	if (fechas.length === 0) return null;

	const startDate = new Date(fechas[0]);
	const endDate = new Date(fechas[fechas.length - 1]);

	const datos = [];
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const yyyyMMdd = d.toISOString().split("T")[0];

		// Formato con nombre corto del día (ej: lun 22/07)
		const label = d.toLocaleDateString("es-AR", {
			weekday: "short",
			day: "2-digit",
			month: "2-digit",
		});

		datos.push({
			fecha: label,
			minutos: Math.round(duracionPorDia[yyyyMMdd] || 0),
		});
	}

	return (
		<div className="w-full h-64">
			<ResponsiveContainer>
				<BarChart data={datos}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="fecha" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="minutos" fill="#2563eb" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
