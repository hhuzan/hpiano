"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Legend } from "recharts";
import { useEffect, useState } from "react";

const MinutosPorDiaStackedChart = () => {
	const [obras, setObras] = useState([]);
	const [data, setData] = useState([]);
	console.log(data);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/minutos_por_dia_y_obra");
			const raw = await res.json();

			raw.forEach((obj) => {
				if ("null" in obj) {
					obj["❓❓❓"] = obj.null;
					delete obj.null;
				}
			});

			setData(raw);
			const claves = [...new Set(raw.flatMap((obj) => Object.keys(obj).filter((k) => k !== "dia")))];
			setObras(claves.sort());
		};
		fetchData();
	}, []);

	const formatXAxis = (tickItem) => {
		const date = new Date(tickItem);
		return date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" });
	};

	return (
		<div className="h-96">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis dataKey="dia" tickFormatter={formatXAxis} />
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
};

export default MinutosPorDiaStackedChart;
