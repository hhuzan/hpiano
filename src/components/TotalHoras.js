"use client";

import { useState, useEffect } from "react";

const TotalHoras = () => {
	const [horas, setHoras] = useState([]);
	const [minutos, setMinutos] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/total_horas");
			const total = await res.json();
			setHoras(total[0]["sum"]["hours"]);
			setMinutos(String(total[0]["sum"]["minutes"]).padStart(2, "0"));
		};
		fetchData();
	}, []);

	return (
		<h1 className="pl-8 text-2xl font-bold">
			Total: {horas}:{minutos} horas
		</h1>
	);
};

export default TotalHoras;
