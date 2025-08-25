// app/page.js
"use client";

import MinutosPorDiaChart from "@/components/MinutosPorDiaChart";
import TiempoPorObraChart from "@/components/TiempoPorObraChart";
import MinutosPorDiaStackedChart from "@/components/MinutosPorDiaStackedChart";
import ListaBloques from "@/components/ListaBloques";
import Total from "@/components/Total";

export default function Home() {
	return (
		<main className="pt-4 pb-4">
			<Total />
			<MinutosPorDiaChart />
			<MinutosPorDiaStackedChart />
			<TiempoPorObraChart />
			<ListaBloques />
		</main>
	);
}
