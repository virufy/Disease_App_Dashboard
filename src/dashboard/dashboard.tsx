import React, {
	useRef,
	useEffect,
	useState,
	useCallback,
	useMemo
} from "react";
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
	ResponsiveContainer
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import DistanceMetricChart from "./DistanceMetricChart";

interface HealthDataEntry {
	AgeGroup: string;
	longitude: number;
	latitude: number;
	Sex: string;
	DistanceMetric: number;
	Symptoms: string[];
}

const translations = {
	en: {
		languageLabel: "Language:",
		symptomsLabel: "Symptoms:",
		clearFiltersLabel: "Clear filters",
		ageTitle: "Age",
		genderTitle: "Gender",
		coughStatsTitle: "Cough Statistics",
		chartKeys: {
			sick: "Sick",
			notSick: "NotSick"
		}
	},
	ar: {
		languageLabel: "اللغة:",
		symptomsLabel: "الأعراض:",
		clearFiltersLabel: "مسح الفلاتر",
		ageTitle: "العمر",
		genderTitle: "الجنس",
		coughStatsTitle: "إحصائيات السعال",
		chartKeys: {
			sick: "مريض",
			notSick: "غير مريض"
		}
	},
	ja: {
		languageLabel: "言語:",
		symptomsLabel: "症状:",
		clearFiltersLabel: "フィルターをクリア",
		ageTitle: "年齢",
		genderTitle: "性別",
		coughStatsTitle: "咳の統計",
		chartKeys: {
			sick: "病気",
			notSick: "健康"
		}
	}
};

const genderTranslations = {
	en: {
		sickMale: "Sick Male",
		nonSickMale: "Non-Sick Male",
		sickFemale: "Sick Female",
		nonSickFemale: "Non-Sick Female"
	},
	ar: {
		sickMale: "ذكر مريض",
		nonSickMale: "ذكر غير مريض",
		sickFemale: "أنثى مريضة",
		nonSickFemale: "أنثى غير مريضة"
	},
	ja: {
		sickMale: "病気の男性",
		nonSickMale: "健康な男性",
		sickFemale: "病気の女性",
		nonSickFemale: "健康な女性"
	}
};

// const mean = 6.026709714020622;
// const stdDev = 2.170383376216376;

const mean = 2.170383376216376;
const stdDev = 2;

const LOCATIONS = {
	siliconValley: {
		label: "Silicon Valley",
		lat: 37.3382,
		lon: -121.8863,
		zoom: 10
	},
	dubai: {
		label: "Dubai",
		lat: 25.2048,
		lon: 55.2708,
		zoom: 10
	}
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

type SelectableSymptomKey = Exclude<SymptomKey, "All">;

const symptoms: Record<SymptomKey, string> = {
	All: "All 🔴",
	heavysmoker: "Heavy Smoker 🚬",
	cold: "Cold 🤒",
	influenza: "Influenza 😷",
	covid: "COVID 🤧",
	sars: "SARS 🦠",
	rsv: "RSV 🏥"
};

// Extract keys for internal use
const symptomKeys = Object.keys(symptoms) as SymptomKey[];
const symptomsTranslations: Record<
	"en" | "ar" | "ja",
	Record<SymptomKey, string>
> = {
	en: {
		All: "All 🔴",
		heavysmoker: "Heavy Smoker 🚬",
		cold: "Cold 🤒",
		influenza: "Influenza 😷",
		covid: "COVID 🤧",
		sars: "SARS 🦠",
		rsv: "RSV 🏥"
	},
	ar: {
		All: "الكل 🔴",
		heavysmoker: "مدخن ثقيل 🚬",
		cold: "برد 🤒",
		influenza: "إنفلونزا 😷",
		covid: "كوفيد 🤧",
		sars: "سارس 🦠",
		rsv: "الفيروس المخلوي التنفسي 🏥"
	},
	ja: {
		All: "すべて 🔴",
		heavysmoker: "ヘビースモーカー 🚬",
		cold: "風邪 🤒",
		influenza: "インフルエンザ 😷",
		covid: "COVID 🤧",
		sars: "SARS 🦠",
		rsv: "RSV 🏥"
	}
};

const ageGroupLabels = [
	"<20",
	"20-30",
	"30-40",
	"40-50",
	"50-60",
	"60-80",
	"80+"
];

const categorizeAgeGroup = (age: number): string => {
	if (age < 20) return "<20";
	if (age >= 20 && age < 30) return "20-30";
	if (age >= 30 && age < 40) return "30-40";
	if (age >= 40 && age < 50) return "40-50";
	if (age >= 50 && age < 60) return "50-60";
	if (age >= 60 && age < 80) return "60-80";
	return "80+";
};

const processSicknessData = (healthData: HealthDataEntry[]) => {
	const ageGroupCounts = ageGroupLabels.reduce(
		(acc, label) => {
			acc[label] = { sick: 0, notSick: 0 };
			return acc;
		},
		{} as Record<string, { sick: number; notSick: number }>
	);

	healthData.forEach((entry) => {
		if (entry.AgeGroup && !isNaN(parseInt(entry.AgeGroup, 10))) {
			const ageGroup = categorizeAgeGroup(parseInt(entry.AgeGroup, 10));
			const isSick = entry.Symptoms && !entry.Symptoms.includes("none");

			if (ageGroupCounts[ageGroup]) {
				if (isSick) {
					ageGroupCounts[ageGroup].sick += 1;
				} else {
					ageGroupCounts[ageGroup].notSick += 1;
				}
			}
		}
	});

	return Object.entries(ageGroupCounts).map(([label, counts]) => ({
		ageGroup: label,
		Sick: counts.sick,
		NotSick: counts.notSick
	}));
};

const processGenderSicknessData = (healthData: HealthDataEntry[]) => {
	let sickMale = 0,
		sickFemale = 0,
		nonSickMale = 0,
		nonSickFemale = 0;

	healthData.forEach((entry) => {
		const isSick = entry.Symptoms && !entry.Symptoms.includes("none");

		if (entry.Sex === "male") {
			if (isSick) {
				sickMale++;
			} else {
				nonSickMale++;
			}
		} else if (entry.Sex === "female") {
			if (isSick) {
				sickFemale++;
			} else {
				nonSickFemale++;
			}
		}
	});

	const total = sickMale + sickFemale + nonSickMale + nonSickFemale;

	// Return default structure with 0 values if no data is available
	if (total === 0) {
		return [
			{ name: "Sick Male", value: 0 },
			{ name: "Non-Sick Male", value: 0 },
			{ name: "Sick Female", value: 0 },
			{ name: "Non-Sick Female", value: 0 }
		];
	}

	return [
		{ name: "Sick Male", value: (sickMale / total) * 100 },
		{ name: "Non-Sick Male", value: (nonSickMale / total) * 100 },
		{ name: "Sick Female", value: (sickFemale / total) * 100 },
		{ name: "Non-Sick Female", value: (nonSickFemale / total) * 100 }
	];
};

const toggleSymptomSelection = (
	selectedSymptoms: SelectableSymptomKey[],
	symptom: SymptomKey
) => {
	if (symptom === "All") {
		return [];
	}

	return selectedSymptoms.includes(symptom)
		? selectedSymptoms.filter((selectedSymptom) => selectedSymptom !== symptom)
		: [...selectedSymptoms, symptom];
};

const isSymptomSelected = (
	selectedSymptoms: SelectableSymptomKey[],
	symptom: SymptomKey
) => {
	if (symptom === "All") {
		return selectedSymptoms.length === 0;
	}

	return selectedSymptoms.includes(symptom);
};

const filterHealthDataBySymptoms = (
	healthData: HealthDataEntry[],
	selectedSymptoms: SelectableSymptomKey[]
) =>
	healthData.filter((entry) => {
		// No explicit selection falls back to the same "All" behavior as before.
		if (selectedSymptoms.length === 0) {
			return !entry.Symptoms.includes("none");
		}

		// Multi-select uses OR matching so any selected symptom keeps the entry.
		return selectedSymptoms.some((symptom) => entry.Symptoms.includes(symptom));
	});

const mergeSelectedSymptoms = (
	leftSymptoms: SelectableSymptomKey[],
	rightSymptoms: SelectableSymptomKey[]
) => Array.from(new Set([...leftSymptoms, ...rightSymptoms]));

const Dashboard: React.FC = () => {
	const [healthData, setHealthData] = useState<HealthDataEntry[]>([]);
	const [selectedLocation, setSelectedLocation] =
		useState<LocationKey>("siliconValley");
	const [selectedSymptomsLeft, setSelectedSymptomsLeft] =
		useState<SelectableSymptomKey[]>(["covid"]);
	const [selectedSymptomsRight, setSelectedSymptomsRight] =
		useState<SelectableSymptomKey[]>(["cold"]);
	const ws = useRef<WebSocket | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar" | "ja">(
		"en"
	);

	const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
	const updateScreenSize = () => setIsDesktop(window.innerWidth > 768);

	const t = translations[selectedLanguage];
	const tg = genderTranslations[selectedLanguage];
	const filteredHealthDataLeft = useMemo(
		() => filterHealthDataBySymptoms(healthData, selectedSymptomsLeft),
		[healthData, selectedSymptomsLeft]
	);
	const filteredHealthDataRight = useMemo(
		() => filterHealthDataBySymptoms(healthData, selectedSymptomsRight),
		[healthData, selectedSymptomsRight]
	);
	const leftPoints = useMemo(
		() =>
			filteredHealthDataLeft.map((entry) => ({
				lat: entry.latitude,
				lng: entry.longitude,
				intensity: 10
			})),
		[filteredHealthDataLeft]
	);
	const rightPoints = useMemo(
		() =>
			filteredHealthDataRight.map((entry) => ({
				lat: entry.latitude,
				lng: entry.longitude,
				intensity: 10
			})),
		[filteredHealthDataRight]
	);
	const chartSelectedSymptoms = useMemo(
		() =>
			isDesktop
				? mergeSelectedSymptoms(selectedSymptomsLeft, selectedSymptomsRight)
				: selectedSymptomsLeft,
		[isDesktop, selectedSymptomsLeft, selectedSymptomsRight]
	);
	const filteredHealthDataForCharts = useMemo(
		() => filterHealthDataBySymptoms(healthData, chartSelectedSymptoms),
		[healthData, chartSelectedSymptoms]
	);
	const sicknessData = useMemo(
		() => processSicknessData(filteredHealthDataForCharts),
		[filteredHealthDataForCharts]
	);
	const genderSicknessData = useMemo(
		() =>
			processGenderSicknessData(filteredHealthDataForCharts) || [
				{ name: "Sick Male", value: 0 },
				{ name: "Non-Sick Male", value: 0 },
				{ name: "Sick Female", value: 0 },
				{ name: "Non-Sick Female", value: 0 }
			],
		[filteredHealthDataForCharts]
	);
	const distanceMetrics = useMemo(
		() =>
			filteredHealthDataForCharts.map((entry) => entry.DistanceMetric),
		[filteredHealthDataForCharts]
	);

	const COLORS = ["#FF6B6B", "#4ECDC4", "#1A535C", "#B565A7"];

	const connectWebSocket = useCallback(() => {
		const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || "";
		ws.current = new WebSocket(websocketURL);

		ws.current.onopen = () => {
			console.log("WebSocket connection opened");

			// Send initial data immediately after connection
			ws.current?.send(JSON.stringify({ action: "send_initial_data" }));
		};

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("WebSocket message received:", data);
			if (data.message === "connected") {
				console.log("WebSocket confirmed connection");
			} else {
				// Handle health data updates
				const healthDataEntry = data as HealthDataEntry;
				if (healthDataEntry.Symptoms) {
					setHealthData((prevData) => [...prevData, healthDataEntry]);
				}
			}
		};

		ws.current.onclose = (event) => {
			console.log("WebSocket connection closed unexpectedly");
			console.log(`Code: ${event.code}, Reason: ${event.reason}`);
		};

		ws.current.onerror = (error) => {
			console.error("WebSocket error:", error);
			ws.current?.close();
		};
	}, []);

	useEffect(() => {
		connectWebSocket(); // Initial connection attempt

		// Ping every 5 minutes to keep the connection alive
		const pingInterval = setInterval(
			() => {
				if (ws.current?.readyState === WebSocket.OPEN) {
					ws.current.send(JSON.stringify({ action: "ping", message: "ping" }));
				}
			},
			5 * 60 * 1000
		);

		return () => {
			clearInterval(pingInterval);
			ws.current?.close();
		};
	}, [connectWebSocket]);

	const handleSymptomSelectLeft = useCallback((symptom: SymptomKey) => {
		setSelectedSymptomsLeft((previousSymptoms) =>
			toggleSymptomSelection(previousSymptoms, symptom)
		);
	}, []);

	const handleSymptomSelectRight = useCallback((symptom: SymptomKey) => {
		setSelectedSymptomsRight((previousSymptoms) =>
			toggleSymptomSelection(previousSymptoms, symptom)
		);
	}, []);

	const clearLeftSymptoms = useCallback(() => {
		setSelectedSymptomsLeft([]);
	}, []);

	const clearRightSymptoms = useCallback(() => {
		setSelectedSymptomsRight([]);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", updateScreenSize);
		return () => window.removeEventListener("resize", updateScreenSize);
	}, []);

	const handleLanguageChange = useCallback((language: "en" | "ar" | "ja") => {
		setSelectedLanguage(language);
		console.log(`Language changed to: ${language}`);
	}, []);

	const CustomTooltipBar = ({ payload, label, active }: any) => {
		if (active && payload && payload.length) {
			return (
				<div
					style={{
						backgroundColor: "white",
						border: "1px solid #ccc",
						borderRadius: "5px",
						padding: "10px",
						boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)"
					}}
				>
					<p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
					{payload.map((entry: any, index: number) => {
						const localizedName =
							entry.name === "Sick" ? t.chartKeys.sick : t.chartKeys.notSick;
						return (
							<p
								key={index}
								style={{
									margin: "5px 0",
									color: entry.color // Use the color of the bar
								}}
							>
								{`${localizedName}: ${entry.value}`}
							</p>
						);
					})}
				</div>
			);
		}
		return null;
	};

	const CustomTooltipPie = ({ payload, active }: any) => {
		if (active && payload && payload.length) {
			const { name, value } = payload[0];
			const localizedName =
				name === "Sick Male"
					? tg.sickMale
					: name === "Non-Sick Male"
						? tg.nonSickMale
						: name === "Sick Female"
							? tg.sickFemale
							: tg.nonSickFemale;
			const isRTL = selectedLanguage === "ar";

			return (
				<div
					style={{
						backgroundColor: "white",
						border: "1px solid #ccc",
						borderRadius: "5px",
						padding: "10px",
						boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
						textAlign: isRTL ? "right" : "left", // Align text based on language
						direction: isRTL ? "rtl" : "ltr" // Set text direction for RTL languages
					}}
				>
					<p
						style={{ margin: 0 }}
					>{`${localizedName}: ${value.toFixed(2)}%`}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<DashboardContainer>
			<HeaderContainer style={{ marginBottom: "4px" }}>
				<SelectionContainer
					style={{
						width: "60px",
						left: "0",
						position: "absolute",
						paddingLeft: "0px"
					}}
				>
					<label
						style={{
							fontSize: "14px",
							marginBottom: "4px",
							paddingTop: "10px"
						}}
					>
						{t.languageLabel}
					</label>
					<SelectDropdown
						style={{ padding: "4px", height: "100%", position: "relative" }}
					>
						<DropdownOption
							key="en"
							onClick={() => handleLanguageChange("en")}
							style={{
								fontWeight: selectedLanguage === "en" ? "bold" : "normal",
								color: selectedLanguage === "en" ? "#007bff" : "black",
								padding: "2px"
							}}
						>
							English
						</DropdownOption>
						<DropdownOption
							key="ja"
							onClick={() => handleLanguageChange("ja")}
							style={{
								fontWeight: selectedLanguage === "ja" ? "bold" : "normal",
								color: selectedLanguage === "ja" ? "#007bff" : "black",
								padding: "2px"
							}}
						>
							Japanese
						</DropdownOption>
						<DropdownOption
							key="ar"
							onClick={() => handleLanguageChange("ar")}
							style={{
								fontWeight: selectedLanguage === "ar" ? "bold" : "normal",
								color: selectedLanguage === "ar" ? "#007bff" : "black",
								padding: "2px"
							}}
						>
							Arabic
						</DropdownOption>
					</SelectDropdown>
				</SelectionContainer>
				<div style={{}}>
					<a
						href="https://virufy.org/en/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<VirufyLogoPNG />
					</a>
					<p style={{ textAlign: "center", fontWeight: "bold" }}>Test data</p>
				</div>
				<a href="/disease-app" target="_blank" rel="noopener noreferrer">
					<QRCode />
				</a>
				<SelectionContainer
					style={{
						width: "140px",
						right: "80px",
						position: "absolute"
					}}
				>
					<label style={{ fontSize: "14px", marginBottom: "4px" }}>
						Location:
					</label>
					<SelectDropdown>
						{(Object.keys(LOCATIONS) as LocationKey[]).map((key) => (
							<DropdownOption
								key={key}
								onClick={() => setSelectedLocation(key)}
								style={{
									fontWeight: selectedLocation === key ? "bold" : "normal",
									color: selectedLocation === key ? "#007bff" : "black"
								}}
							>
								{LOCATIONS[key].label}
							</DropdownOption>
						))}
					</SelectDropdown>
				</SelectionContainer>
			</HeaderContainer>
			<HeatmapContainer>
				<HeatmapCard>
					<MapComponent
						lat={LOCATIONS[selectedLocation].lat}
						lon={LOCATIONS[selectedLocation].lon}
						zoom={LOCATIONS[selectedLocation].zoom}
						points={leftPoints}
					/>

					<SelectionContainer>
						<label style={{ fontSize: "14px", marginBottom: "10px" }}>
							{t.symptomsLabel}
						</label>
						{selectedSymptomsLeft.length > 0 && (
							<button
								onClick={clearLeftSymptoms}
								style={{
									background: "none",
									border: "none",
									color: "#007bff",
									cursor: "pointer",
									fontSize: "12px",
									marginBottom: "8px",
									padding: 0
								}}
								type="button"
							>
								{t.clearFiltersLabel}
							</button>
						)}
						<SelectDropdown>
							{symptomKeys.map((symptom: SymptomKey) => (
								<DropdownOption
									key={symptom}
									onClick={() => handleSymptomSelectLeft(symptom)}
									style={{
										fontWeight: isSymptomSelected(selectedSymptomsLeft, symptom)
											? "bold"
											: "normal",
										color: isSymptomSelected(selectedSymptomsLeft, symptom)
											? "#007bff"
											: "black"
									}}
								>
									{symptomsTranslations[selectedLanguage][symptom]}
								</DropdownOption>
							))}
						</SelectDropdown>
					</SelectionContainer>
				</HeatmapCard>
				{isDesktop && (
					<HeatmapCard>
						<MapComponent
							lat={LOCATIONS[selectedLocation].lat}
							lon={LOCATIONS[selectedLocation].lon}
							zoom={LOCATIONS[selectedLocation].zoom}
							points={rightPoints}
						/>

						<SelectionContainer>
							<label style={{ fontSize: "14px", marginBottom: "10px" }}>
								{t.symptomsLabel}
							</label>
							{selectedSymptomsRight.length > 0 && (
								<button
									onClick={clearRightSymptoms}
									style={{
										background: "none",
										border: "none",
										color: "#007bff",
										cursor: "pointer",
										fontSize: "12px",
										marginBottom: "8px",
										padding: 0
									}}
									type="button"
								>
									{t.clearFiltersLabel}
								</button>
							)}
							<SelectDropdown>
								{symptomKeys.map((symptom: SymptomKey) => (
									<DropdownOption
										key={symptom}
										onClick={() => handleSymptomSelectRight(symptom)}
										style={{
											fontWeight: isSymptomSelected(
												selectedSymptomsRight,
												symptom
											)
												? "bold"
												: "normal",
											color: isSymptomSelected(
												selectedSymptomsRight,
												symptom
											)
												? "#007bff"
												: "black"
										}}
									>
										{symptomsTranslations[selectedLanguage][symptom]}
									</DropdownOption>
								))}
							</SelectDropdown>
						</SelectionContainer>
					</HeatmapCard>
				)}
			</HeatmapContainer>
			<BottomCardsContainer>
				<BottomCard>
					<div
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							marginBottom: "10px",
							height: "5%",
							fontSize: "100%"
						}}
					>
						{t.ageTitle}
					</div>
					<ResponsiveContainer width="100%" height="93%">
						<BarChart data={sicknessData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="ageGroup" />
							<YAxis />
							<Tooltip content={<CustomTooltipBar />} />
							<Legend
								formatter={(value) =>
									value === "Sick" ? t.chartKeys.sick : t.chartKeys.notSick
								}
							/>
							<Bar dataKey="Sick" name={t.chartKeys.sick} fill="#FF6B6B" />
							<Bar
								dataKey="NotSick"
								name={t.chartKeys.notSick}
								fill="#4ECDC4"
							/>
						</BarChart>
					</ResponsiveContainer>
				</BottomCard>
				<BottomCard>
					<div
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							marginBottom: "10px",
							height: "5%",
							fontSize: "100%"
						}}
					>
						{t.genderTitle}
					</div>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
							{" "}
							{/* Adds margin for label space */}
							<Pie
								data={genderSicknessData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius="100%"
								fill="#8884d8"
								labelLine={false}
							>
								{genderSicknessData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								content={
									<CustomTooltipPie selectedLanguage={selectedLanguage} />
								}
							/>
							<Legend
								formatter={(value) => {
									return value === "Sick Male"
										? genderTranslations[selectedLanguage].sickMale
										: value === "Non-Sick Male"
											? genderTranslations[selectedLanguage].nonSickMale
											: value === "Sick Female"
												? genderTranslations[selectedLanguage].sickFemale
												: genderTranslations[selectedLanguage].nonSickFemale;
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</BottomCard>
				<BottomCard>
					<div
						style={{
							marginLeft: "auto",
							marginRight: "auto",
							marginBottom: "10px",
							height: "5%",
							fontSize: "100%"
						}}
					>
						{t.coughStatsTitle}
					</div>
					<DistanceMetricChart
						mean={mean}
						stdDev={stdDev}
						distanceMetrics={distanceMetrics}
						language={selectedLanguage}
					/>
				</BottomCard>
			</BottomCardsContainer>
		</DashboardContainer>
	);
};

export default Dashboard;
