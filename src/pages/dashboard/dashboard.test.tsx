import { render } from "@testing-library/react";
import Dashboard, { filterHealthData } from "./dashboard";

jest.mock("../../components/map/MapComponent", () => () => (
	<div data-testid="map" />
));

jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { changeLanguage: jest.fn() }
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
				longitude: 1,
				latitude: 2,
				Sex: "male",
				DistanceMetric: 3,
				Symptoms: ["fever"]
			},
			{
				AgeGroup: "25",
				longitude: 4,
				latitude: 5,
				Sex: "female",
				DistanceMetric: 6,
				Symptoms: ["none"]
			}
		] as any[];

		const filtered = filterHealthData(data, "siliconValley", "fever");
		expect(filtered).toHaveLength(1);
		expect(filtered[0].Symptoms).toEqual(["fever"]);
	});
});
