"use client";

import { useEffect, useState } from "react";

const UltimaVez = () => {
	const [ultimaVez, setUltimaVez] = useState([]);

	useEffect(() => {
		fetch("/api/ultima_vez")
			.then((res) => res.json())
			.then(setUltimaVez);
	}, []);

	function formatearIntervalo(ultima) {
		if (!ultima) return "-";

		const d = ultima.days ?? 0;
		const h = String(ultima.hours ?? 0).padStart(2, "0");
		const m = String(ultima.minutes ?? 0).padStart(2, "0");

		if (d > 0) {
			return `${d} días ${h}:${m}`;
		} else {
			return `${h}:${m}`;
		}
	}

	return (
		<div>
			{ultimaVez.map((obra, index) => (
				<div key={index} className="flex justify-between text-sm border p-4 space-y-2 w-1/2 mx-auto">
					<div>
						<strong>{obra.nombre}</strong>
					</div>
					<div>
						<strong>{formatearIntervalo(obra.ultima)}</strong>
					</div>
				</div>
			))}
		</div>
	);
};

export default UltimaVez;
