"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, LabelList, Line } from "recharts";

const MinutosPorDiaChart = () => {
	const [minutosPorDia, setMinutosPorDia] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/minutos_por_dia");
			const raw = await res.json();
			const windowSize = 7;
			const dataWithMA = raw.map((d, i) => {
				const start = Math.max(0, i - windowSize + 1);
				const windowData = raw.slice(start, i + 1);
				const avg = windowData.reduce((sum, item) => sum + Number(item.minutos), 0) / windowData.length;
				return { ...d, movingAvg: avg };
			});
			setMinutosPorDia(dataWithMA);
		};
		fetchData();
	}, []);

	// 🧮 Cálculo del promedio
	const total = minutosPorDia.reduce((sum, d) => sum + Number(d.minutos), 0);
	const promedio = Math.round(total / minutosPorDia.length);

	const formatXAxis = (tickItem) => {
		const date = new Date(tickItem);
		return date.toLocaleDateString("es-AR", { month: "short", day: "numeric" });
	};

	return (
		<div className="w-full h-64">
			<ResponsiveContainer>
				<BarChart data={minutosPorDia}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="dia" tickFormatter={formatXAxis} />
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
					<Line type="monotone" dataKey="movingAvg" stroke="#ff7300" dot={false} strokeWidth={2} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MinutosPorDiaChart;
