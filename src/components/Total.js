"use client";

import { useState, useEffect } from "react";

const Total = () => {
	const [dias, setDias] = useState();
	const [horas, setHoras] = useState();
	const [minutos, setMinutos] = useState("00");
	const [notas, setNotas] = useState();
	const [promedio, setPromedio] = useState("00:00:00");
	const [falta, setFalta] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/total");
			const total = await res.json();
			setDias(total[0]["dias"]);
			if (total[0]["tiempo"]["hours"]) setHoras(total[0]["tiempo"]["hours"]);
			if (total[0]["tiempo"]["minutes"]) setMinutos(String(total[0]["tiempo"]["minutes"]).padStart(2, "0"));
			setNotas(total[0]["notas"]);

			if (total[0]["dias"] > 0) {
				const totalSegundos = total[0]["tiempo"]["hours"] * 3600 + total[0]["tiempo"]["minutes"] * 60;
				const promedioSegundos = totalSegundos / total[0]["dias"];
				const h = Math.floor(promedioSegundos / 3600);
				const m = Math.floor((promedioSegundos % 3600) / 60);
				const s = Math.floor(promedioSegundos % 60);
				const f = Math.ceil(((-60 + (promedioSegundos % 60)) * total[0]["dias"]) / 60);
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
