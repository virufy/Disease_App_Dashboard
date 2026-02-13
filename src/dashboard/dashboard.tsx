import React, { useRef, useEffect, useState, useCallback } from "react";
import MapComponent from "./MapComponent";
import {
	DashboardContainer,
	HeatmapContainer,
	HeatmapCard,
	BottomCardsContainer,
	BottomCard,
	VirufyLogoPNG,
	SelectionContainer,
	SelectDropdown,
	DropdownOption,
	QRCode,
	HeaderContainer
} from "./DashboardStyles";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell
} from "recharts";

/* ===================== Types ===================== */

interface HealthDataEntry {
	AgeGroup: string;
	longitude: number;
	latitude: number;
	Sex: string;
	DistanceMetric: number;
	Symptoms: string[];
}

/* ===================== Constants ===================== */

const LOCATIONS = {
	siliconValley: {
		label: "Silicon Valley",
		lat: 37.3382,
		lon: -121.8863,
		zoom: 10
	},
	dubai: { label: "Dubai", lat: 25.2048, lon: 55.2708, zoom: 10 }
} as const;

type LocationKey = keyof typeof LOCATIONS;

type SymptomKey =
	| "All"
	| "heavysmoker"
	| "cold"
	| "influenza"
	| "covid"
	| "sars"
	| "rsv";

const symptomKeys: SymptomKey[] = [
	"All",
	"heavysmoker",
	"cold",
	"influenza",
	"covid",
	"sars",
	"rsv"
];

const COLORS = ["#FF6B6B", "#4ECDC4", "#1A535C", "#B565A7"];

/* ===================== Helpers ===================== */

const ageGroupLabels = [
	"<20",
	"20-30",
	"30-40",
	"40-50",
	"50-60",
	"60-80",
	"80+"
];

const categorizeAgeGroup = (age: number) => {
	if (age < 20) return "<20";
	if (age < 30) return "20-30";
	if (age < 40) return "30-40";
	if (age < 50) return "40-50";
	if (age < 60) return "50-60";
	if (age < 80) return "60-80";
	return "80+";
};

const processSicknessData = (healthData: HealthDataEntry[]) => {
	const counts = Object.fromEntries(
		ageGroupLabels.map((label) => [label, { sick: 0, notSick: 0 }])
	);

	healthData.forEach(({ AgeGroup, Symptoms }) => {
		const age = parseInt(AgeGroup, 10);
		if (isNaN(age)) return;

		const group = categorizeAgeGroup(age);
		const isSick = Symptoms && !Symptoms.includes("none");

		isSick ? counts[group].sick++ : counts[group].notSick++;
	});

	return Object.entries(counts).map(([ageGroup, v]) => ({
		ageGroup,
		Sick: v.sick,
		NotSick: v.notSick
	}));
};

const processGenderSicknessData = (healthData: HealthDataEntry[]) => {
	let sickMale = 0,
		sickFemale = 0,
		nonSickMale = 0,
		nonSickFemale = 0;

	healthData.forEach(({ Sex, Symptoms }) => {
		const isSick = Symptoms && !Symptoms.includes("none");

		if (Sex === "male") isSick ? sickMale++ : nonSickMale++;
		if (Sex === "female") isSick ? sickFemale++ : nonSickFemale++;
	});

	const total = sickMale + sickFemale + nonSickMale + nonSickFemale || 1;

	return [
		{ name: "Sick Male", value: (sickMale / total) * 100 },
		{ name: "Non-Sick Male", value: (nonSickMale / total) * 100 },
		{ name: "Sick Female", value: (sickFemale / total) * 100 },
		{ name: "Non-Sick Female", value: (nonSickFemale / total) * 100 }
	];
};

/* ===================== Component ===================== */

const Dashboard: React.FC = () => {
	const [healthData, setHealthData] = useState<HealthDataEntry[]>([]);
	const [selectedLocation, setSelectedLocation] =
		useState<LocationKey>("siliconValley");
	const [selectedSymptom, setSelectedSymptom] = useState<SymptomKey>("covid");

	const ws = useRef<WebSocket | null>(null);

	const sicknessData = processSicknessData(healthData);
	const genderData = processGenderSicknessData(healthData);

	/* ---------- WebSocket ---------- */

	const connectWebSocket = useCallback(() => {
		ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || "");

		ws.current.onopen = () => {
			ws.current?.send(JSON.stringify({ action: "send_initial_data" }));
		};

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data?.Symptoms) {
				setHealthData((prev) => [...prev, data]);
			}
		};

		ws.current.onerror = () => ws.current?.close();
	}, []);

	useEffect(() => {
		connectWebSocket();
		return () => ws.current?.close();
	}, [connectWebSocket]);

	/* ===================== Render ===================== */

	return (
		<DashboardContainer>
			<HeaderContainer>
				<VirufyLogoPNG />

				<SelectionContainer>
					<label>Location:</label>
					<SelectDropdown>
						{Object.keys(LOCATIONS).map((key) => (
							<DropdownOption
								key={key}
								onClick={() => setSelectedLocation(key as LocationKey)}
							>
								{LOCATIONS[key as LocationKey].label}
							</DropdownOption>
						))}
					</SelectDropdown>
				</SelectionContainer>

				<a href="/disease-app" target="_blank" rel="noopener noreferrer">
					<QRCode />
				</a>
			</HeaderContainer>

			{/* ===================== MAP ===================== */}
			<HeatmapContainer>
				<HeatmapCard>
					<MapComponent
						{...LOCATIONS[selectedLocation]}
						points={healthData
							.filter((e) =>
								selectedSymptom === "All"
									? !e.Symptoms.includes("none")
									: e.Symptoms.includes(selectedSymptom)
							)
							.map((e) => ({
								lat: e.latitude,
								lng: e.longitude,
								intensity: 10
							}))}
					/>

					<SelectionContainer>
						<label>Symptoms:</label>
						<SelectDropdown>
							{symptomKeys.map((s) => (
								<DropdownOption key={s} onClick={() => setSelectedSymptom(s)}>
									{s}
								</DropdownOption>
							))}
						</SelectDropdown>
					</SelectionContainer>
				</HeatmapCard>
			</HeatmapContainer>

			{/* ===================== CHARTS ===================== */}
			<BottomCardsContainer>
				<BottomCard>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={sicknessData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="ageGroup" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="Sick" fill="#FF6B6B" />
							<Bar dataKey="NotSick" fill="#4ECDC4" />
						</BarChart>
					</ResponsiveContainer>
				</BottomCard>

				<BottomCard>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie data={genderData} dataKey="value" outerRadius="80%">
								{genderData.map((_, i) => (
									<Cell key={i} fill={COLORS[i % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</BottomCard>
			</BottomCardsContainer>
		</DashboardContainer>
	);
};

export default Dashboard;
