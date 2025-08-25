"use client";

import { useState, useEffect } from "react";

const Total = () => {
	const [dias, setDias] = useState([]);
	const [horas, setHoras] = useState([]);
	const [minutos, setMinutos] = useState([]);
	const [notas, setNotas] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/total");
			const total = await res.json();
			setDias(total[0]["dias"]);
			setHoras(total[0]["tiempo"]["hours"]);
			setMinutos(String(total[0]["tiempo"]["minutes"]).padStart(2, "0"));
			setNotas(total[0]["notas"]);
		};
		fetchData();
	}, []);

	return (
		<h1 className="flex flex-row justify-between pl-8 text-2xl font-bold">
			<div>Total:</div>
			<div>{dias} días</div>
			<div>
				{horas}:{minutos} horas
			</div>
			<div>{notas} notas</div>
		</h1>
	);
};

export default Total;
