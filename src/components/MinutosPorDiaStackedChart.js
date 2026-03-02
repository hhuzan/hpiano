"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Legend } from "recharts";
import { useEffect, useState } from "react";

const MinutosPorDiaStackedChart = () => {
	const [obras, setObras] = useState([]);
	const [data, setData] = useState([]);
	const [totales, setTotales] = useState({});

	useEffect(() => {
		let mounted = true;

		const fetchData = async () => {
			const res = await fetch("/api/minutos_por_dia_y_obra");
			const raw = await res.json();

			if (!mounted) return;

			setData(raw);

			// 🔥 calcular total acumulado por obra
			const acumulados = {};

			raw.forEach((obj) => {
				Object.entries(obj).forEach(([key, value]) => {
					if (key !== "dia") {
						acumulados[key] = (acumulados[key] || 0) + Number(value);
					}
				});
			});

			// ordenar de mayor a menor total
			const clavesOrdenadas = Object.keys(acumulados).sort((a, b) => acumulados[b] - acumulados[a]);

			setTotales(acumulados);
			setObras(clavesOrdenadas);
		};

		fetchData();

		return () => {
			mounted = false;
		};
	}, []);

	// ✅ FIX: crear fecha en horario local (evita corrimiento)
	const formatXAxis = (tickItem) => {
		if (!tickItem) return "";

		const [year, month, day] = tickItem.split("-");
		const date = new Date(Number(year), Number(month) - 1, Number(day));

		return date.toLocaleDateString("es-AR", {
			weekday: "short",
			day: "numeric",
		});
	};

	return (
		<div className="h-96">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis dataKey="dia" tickFormatter={formatXAxis} />
					<YAxis domain={[0, "auto"]} />
					<Legend formatter={(value) => `${value} (${Math.round(totales[value] || 0)} min)`} />

					{/* 🎨 Patrones para obras (excepto "???") */}
					<defs>
						{obras.map((obra, index) => {
							if (obra === "???") return null;

							const color = `hsl(${(index * 60) % 360}, 70%, 50%)`;
							const patternType = Math.floor(index / 6) % 2 === 0 ? "solid" : "diagonal-stripes";
							const fullId = `${patternType}-${index}`;

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
									{patternType === "diagonal-stripes" && (
										<line x1="0" y1="0" x2="0" y2="10" stroke="black" strokeWidth="2" />
									)}
								</pattern>
							);
						})}
					</defs>

					{/* 📊 Barras */}
					{obras.map((obra, index) => {
						// 🩶 Caso especial: ??? (gris fijo)
						if (obra === "???") {
							return (
								<Bar key={obra} dataKey={obra} stackId="a" fill="#9CA3AF">
									<LabelList
										dataKey={obra}
										position="center"
										formatter={(value) => (Number(value) > 0 ? Math.round(value) : null)}
										fill="white"
									/>
								</Bar>
							);
						}

						const patternType = Math.floor(index / 6) % 2 === 0 ? "solid" : "diagonal-stripes";

						return (
							<Bar key={obra} dataKey={obra} stackId="a" fill={`url(#${patternType}-${index})`}>
								<LabelList
									dataKey={obra}
									position="center"
									formatter={(value) => (Number(value) > 0 ? Math.round(value) : null)}
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
