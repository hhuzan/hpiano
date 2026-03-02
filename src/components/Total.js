"use client";

import { useState, useEffect } from "react";

const Total = () => {
	const [dias, setDias] = useState(0);
	const [horas, setHoras] = useState(0);
	const [minutos, setMinutos] = useState("00");
	const [notas, setNotas] = useState(0);
	const [promedio, setPromedio] = useState("00:00:00");
	const [falta, setFalta] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/total");
			const total = await res.json();

			const dias_ = total?.dias ?? 0;
			const minutosTotales = total?.minutos_totales ?? 0;
			const notasTotales = total?.notas_totales ?? 0;

			setDias(dias_);
			setNotas(notasTotales);

			const totalHoras = Math.floor(minutosTotales / 60);
			const restoMinutos = minutosTotales % 60;

			setHoras(totalHoras);
			setMinutos(String(restoMinutos).padStart(2, "0"));

			if (dias_ > 0) {
				const promedioMinutos = minutosTotales / dias_;

				const h = Math.floor(promedioMinutos / 60);
				const m = Math.floor(promedioMinutos % 60);
				const s = Math.floor((promedioMinutos * 60) % 60);

				setPromedio(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);

				const promedioEntero = Math.floor(promedioMinutos);
				const objetivo = promedioEntero + 1;

				const faltaMinutos = objetivo * dias_ - minutosTotales;

				setFalta(faltaMinutos);
			}
		};

		fetchData();
	}, []);

	return (
		<h1 className="flex flex-row justify-between pl-8 pb-4 text-2xl font-bold">
			<div>Total:</div>
			<div>{dias} días</div>
			<div>
				{horas}:{minutos} horas
			</div>
			<div>{notas} notas</div>
			<div>Prom.: {promedio}</div>
			<div className="font-thin text-[#666] text-xl">[{falta}]</div>
		</h1>
	);
};

export default Total;
