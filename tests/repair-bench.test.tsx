import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RepairBench } from "@/components/patchwork/repair-bench";

describe("RepairBench", () => {
  it("renders the plate and switches layers", async () => {
    const browser = userEvent.setup();
    render(<RepairBench />);

    expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
    const battery = screen.getByRole("button", { name: /Battery/ });
    expect(battery).toHaveAttribute("aria-pressed", "false");
    await browser.click(battery);
    expect(battery).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 / 4 · A2848")).toBeInTheDocument();
  });

  it("hides layer controls in compact mode", () => {
    render(<RepairBench compact />);
    expect(screen.queryByRole("button", { name: /Battery/ })).not.toBeInTheDocument();
    expect(screen.getByText("Teardown")).toBeInTheDocument();
    expect(screen.getByText("Drawn to scale · four service layers")).toBeInTheDocument();
  });
});
