"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, LabelList } from "recharts";

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

	const datos = fechas.map((yyyyMMdd) => {
		const fechaObj = new Date(`${yyyyMMdd}T00:00:00`);
		const label = fechaObj.toLocaleDateString("es-AR", {
			weekday: "short",
			day: "2-digit",
			month: "2-digit",
			timeZone: "America/Argentina/Buenos_Aires",
		});
		return {
			fecha: label,
			minutos: Math.round(duracionPorDia[yyyyMMdd] || 0),
		};
	});

	// 🧮 Cálculo del promedio
	const total = datos.reduce((sum, d) => sum + d.minutos, 0);
	const promedio = Math.round(total / datos.length);

	return (
		<div className="w-full h-64">
			<ResponsiveContainer>
				<BarChart data={datos}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="fecha" />
					<YAxis />
					{/* <Tooltip /> */}
					<Bar dataKey="minutos" fill="#2563eb">
						<LabelList dataKey="minutos" position="insideTop" fill="yellow" />
					</Bar>
					<ReferenceLine
						y={promedio}
						stroke="red"
						strokeDasharray="3 3"
						label={{
							position: "center",
							value: `Promedio: ${promedio} min`,
							fill: "red",
						}}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
