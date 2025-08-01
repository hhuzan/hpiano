"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function MinutosPorDiaStackedChart() {
	const [data, setData] = useState([]);
	const [keys, setKeys] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/minutos_por_dia_y_obra");
			const raw = await res.json();

			// Obtener los nombres únicos de obras
			const allKeys = new Set();
			raw.forEach((item) => {
				Object.keys(item).forEach((key) => {
					if (key !== "dia") allKeys.add(key);
				});
			});

			setKeys([...allKeys]);
			setData(raw);
		};

		fetchData();
	}, []);

	return (
		<div className="h-96">
			{/* <h2 className="text-xl font-semibold mb-2">Minutos por día (por obra)</h2> */}
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis dataKey="dia" />
					<YAxis />
					<Tooltip />
					<Legend />
					{keys.map((obra, index) => (
						<Bar
							key={obra}
							dataKey={obra}
							stackId="a"
							fill={`hsl(${(index * 60) % 360}, 70%, 50%)`} // colores distintos
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
