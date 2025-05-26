// filepath: frontend/src/__tests__/App.test.jsx
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders sidebar menu", () => {
  render(<App />);
  expect(screen.getByText(/Menu/i)).toBeInTheDocument();
});