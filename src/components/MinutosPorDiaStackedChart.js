"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Legend } from "recharts";
import { useEffect, useState } from "react";

export default function MinutosPorDiaStackedChart() {
	const [data, setData] = useState([]);
	const [obras, setObras] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/minutos_por_dia_y_obra");
			const raw = await res.json();
			setData(raw);

			const primeraFila = raw[0];
			if (primeraFila) {
				const claves = Object.keys(primeraFila).filter((k) => k !== "dia");
				setObras(claves);
			}
		};
		fetchData();
	}, []);

	// Calcular totales diarios para el label encima de la pila
	const dataConTotales = data.map((row) => {
		const total = obras.reduce((acc, obra) => acc + (row[obra] || 0), 0);
		return { ...row, total };
	});

	return (
		<div className="h-96">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={dataConTotales}>
					<XAxis dataKey="dia" />
					<YAxis />
					<Legend />

					<defs>
						{obras.map((obra, index) => {
							const color = `hsl(${(index * 60) % 360}, 70%, 50%)`;
							const patternId = Math.floor(index / 6) % 2 === 0 ? "solid" : "diagonal-stripes";
							const fullId = `${patternId}-${index}`;

							return (
								<pattern
									id={fullId}
									key={fullId}
									patternUnits="userSpaceOnUse"
									width="10"
									height="10"
									patternTransform="rotate(45)"
								>
									<rect width="10" height="10" fill={color} />
									{patternId === "diagonal-stripes" && (
										<line x1="0" y1="0" x2="0" y2="10" stroke="black" strokeWidth="2" />
									)}
								</pattern>
							);
						})}
					</defs>

					{/* <Bar dataKey="total" fill="transparent">
						<LabelList
							dataKey="total"
							position="top"
							formatter={(value) => (value > 0 ? value.toFixed(1) : "")}
							style={{ fill: "yellow", fontWeight: "bold", fontSize: 13 }}
						/>
					</Bar> */}

					{obras.map((obra, index) => {
						const patternId = Math.floor(index / 6) % 2 === 0 ? "solid" : "diagonal-stripes";
						return (
							<Bar key={obra} dataKey={obra} stackId="a" fill={`url(#${patternId}-${index})`}>
								<LabelList
									dataKey={obra}
									position="center"
									formatter={(value) => (value > 0 ? value.toFixed() : "")}
									fill="white"
								/>
							</Bar>
						);
					})}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
