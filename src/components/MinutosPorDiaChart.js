"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, LabelList } from "recharts";

export default function MinutosPorDiaChart() {
	const [minutosPorDia, setMinutosPorDia] = useState([]);

	useEffect(() => {
		fetch("/api/minutos_por_dia")
			.then((res) => res.json())
			.then((data) =>
				setMinutosPorDia(
					data.map((item) => ({
						...item,
						dia: new Date(item.dia).toLocaleDateString("es-AR", {
							month: "2-digit",
							day: "2-digit",
						}),
					}))
				)
			);
	}, []);

	// 🧮 Cálculo del promedio
	const total = minutosPorDia.reduce((sum, d) => sum + Number(d.minutos), 0);
	const promedio = Math.round(total / minutosPorDia.length);

	return (
		<div className="w-full h-64">
			<ResponsiveContainer>
				<BarChart data={minutosPorDia}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="dia" />
					<YAxis />
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
