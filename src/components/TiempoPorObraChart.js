// components/TiempoPorObraChart.jsx
"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export default function TiempoPorObraChart() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch("/api/tiempo_por_obra")
			.then((res) => res.json())
			.then((raw) => {
				const parsed = raw.map((item) => {
					const minutosNum = Number(item.minutos);
					return {
						obra: item.obra,
						minutos: isNaN(minutosNum) ? 0 : Number(minutosNum.toFixed()),
					};
				});
				setData(parsed);
			});
	}, []);

	const formater = () => {
		return "";
	};

	return (
		<div className="mt-10">
			{/* <h2 className="text-xl font-bold mb-4">Tiempo proporcional por obra (minutos)</h2> */}
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis type="number" label={{ value: "Minutos", position: "insideBottom", offset: -5 }} />
					{/* <YAxis type="category" dataKey="obra" width={150} /> */}
					<YAxis type="category" tickFormatter={formater} width={0} />
					{/* <Tooltip formatter={(value) => (typeof value === "number" ? `${value.toFixed(1)} min` : value)} /> */}
					<Bar dataKey="minutos" fill="#4f46e5">
						<LabelList
							dataKey="obra"
							position="insideLeft"
							fill="yellow"
							// formatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)}
						/>
						<LabelList
							dataKey="minutos"
							position="insideRight"
							fill="yellow"
							// formatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
