// app/page.js
"use client";

import MinutosPorDiaChart from "@/components/MinutosPorDiaChart";
import TiempoPorObraChart from "@/components/TiempoPorObraChart";
import MinutosPorDiaStackedChart from "@/components/MinutosPorDiaStackedChart";
import ListaBloques from "@/components/ListaBloques";
import UltimaVez from "@/components/UltimaVez";
import Total from "@/components/Total";

export default function Home() {
	return (
		<main className="pt-4 pb-4 space-y-6">
			<Total />
			<MinutosPorDiaChart />
			<MinutosPorDiaStackedChart />
			<UltimaVez />
			<TiempoPorObraChart />
			<ListaBloques />
		</main>
	);
}
