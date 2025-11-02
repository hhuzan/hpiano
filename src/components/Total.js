"use client";

import { useState, useEffect } from "react";

const Total = () => {
	const [dias, setDias] = useState(0);
	const [horas, setHoras] = useState(0);
	const [minutos, setMinutos] = useState("00");
	const [notas, setNotas] = useState();
	const [promedio, setPromedio] = useState("00:00:00");
	const [falta, setFalta] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/total");
			const total = await res.json();

			const dias_ = total[0]?.dias ?? 0;
			const { hours = 0, minutes = 0, seconds = 0 } = total[0]?.tiempo ?? {};

			setNotas(total[0]["notas"]);
			setDias(dias_);
			setHoras(hours);
			setMinutos(String(minutes).padStart(2, "0"));

			if (dias_ > 0) {
				const totalSegundos = hours * 3600 + minutes * 60 + seconds;
				const promedioSegundos = totalSegundos / dias_;
				const h = Math.floor(promedioSegundos / 3600);
				const m = Math.floor((promedioSegundos % 3600) / 60);
				const s = Math.floor(promedioSegundos % 60);
				const f = Math.ceil(((-60 + (promedioSegundos % 60)) * dias_) / 60);
				setFalta(f);
				setPromedio(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
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
