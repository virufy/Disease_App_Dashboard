import { render } from "@testing-library/react";
import Dashboard, { filterHealthData } from "./dashboard";

jest.mock("../../components/map/MapComponent", () => () => (
	<div data-testid="map" />
));

jest.mock("../../components/charts/BottomCharts", () => () => (
	<div data-testid="bottom-charts" />
));

jest.mock("../../components/SideMenu/SideMenu", () => () => (
	<div data-testid="side-menu" />
));

jest.mock("../../services/symptomService", () => ({
	fetchSymptoms: jest.fn().mockResolvedValue([])
}));

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { changeLanguage: jest.fn(), language: "en" }
	})
}));

describe("Dashboard WebSocket handling", () => {
	it("renders without crashing when websocket is unavailable", () => {
		const originalEnv = process.env.REACT_APP_WEBSOCKET_URL;
		process.env.REACT_APP_WEBSOCKET_URL = "";

		const { container } = render(<Dashboard />);
		expect(container).toBeTruthy();

		process.env.REACT_APP_WEBSOCKET_URL = originalEnv;
	});

	it("filters data by selected symptom and location", () => {
		const data = [
			{
				AgeGroup: "25",
				longitude: -121.9,
				latitude: 37.3,
				Sex: "male",
				DistanceMetric: 3,
				Symptoms: ["fever"]
			},
			{
				AgeGroup: "25",
				longitude: -122.0,
				latitude: 37.7,
				Sex: "female",
				DistanceMetric: 6,
				Symptoms: ["none"]
			}
		] as any[];

		const filtered = filterHealthData(data, "siliconValley", ["fever"]);
		expect(filtered).toHaveLength(1);
		expect(filtered[0].Symptoms).toEqual(["fever"]);
	});

	it("includes entries matching any selected symptom and keeps all when no symptom is selected", () => {
		const data = [
			{
				AgeGroup: "25",
				longitude: -121.9,
				latitude: 37.3,
				Sex: "male",
				DistanceMetric: 3,
				Symptoms: ["fever"]
			},
			{
				AgeGroup: "35",
				longitude: -121.9,
				latitude: 37.3,
				Sex: "male",
				DistanceMetric: 8,
				Symptoms: ["cough"]
			},
			{
				AgeGroup: "45",
				longitude: -122.0,
				latitude: 37.7,
				Sex: "female",
				DistanceMetric: 2,
				Symptoms: ["none"]
			}
		] as any[];

		expect(
			filterHealthData(data, "siliconValley", ["fever", "cough"]).length
		).toBe(2);
		expect(filterHealthData(data, "siliconValley", []).length).toBe(3);
		expect(filterHealthData(data, "siliconValley", ["all"]).length).toBe(3);
	});
});
