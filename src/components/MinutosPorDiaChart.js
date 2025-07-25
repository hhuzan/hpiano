// components/MinutosPorDiaChart.js
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MinutosPorDiaChart({ bloques }) {
	// Agrupar duración por fecha
	const datosPorDia = bloques.reduce((acc, b) => {
		const fecha = new Date(b.start_time).toISOString().slice(0, 10);
		const duracion = (new Date(b.end_time) - new Date(b.start_time)) / 60000;
		acc[fecha] = (acc[fecha] || 0) + duracion;
		return acc;
	}, {});

	const data = Object.entries(datosPorDia).map(([fecha, minutos]) => ({
		fecha,
		minutos: Math.round(minutos),
	}));

	return (
		<section className="h-64 w-full">
			<h2 className="text-lg font-semibold mb-2">Minutos por día</h2>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="fecha" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="minutos" fill="#3b82f6" />
				</BarChart>
			</ResponsiveContainer>
		</section>
	);
}
