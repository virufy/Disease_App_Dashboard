import { render } from "@testing-library/react";
import Dashboard from "./dashboard";

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
});
