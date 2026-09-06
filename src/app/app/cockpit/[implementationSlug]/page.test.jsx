import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getExplorerMock, notFoundMock } = vi.hoisted(() => ({
  getExplorerMock: vi.fn(),
  notFoundMock: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
}));

vi.mock("../../../../lib/content/repository", () => ({ getCockpitExplorer: getExplorerMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

import CockpitExplorerPage from "./page";

const explorer = {
  implementation: {
    slug: "ifly-737-max-8-msfs-2024",
    aircraftName: "Boeing 737 MAX 8",
    addonDeveloper: "iFly",
    simulatorName: "Microsoft Flight Simulator 2024",
  },
  areas: [{ id: "cockpit", parentId: null, slug: "cockpit", title: "Cockpit", views: [] }],
  controls: [],
};

async function renderPage(slug = "ifly-737-max-8-msfs-2024") {
  const page = await CockpitExplorerPage({
    params: Promise.resolve({ implementationSlug: slug }),
    searchParams: Promise.resolve({}),
  });
  return renderToStaticMarkup(page);
}

describe("CockpitExplorerPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getExplorerMock.mockResolvedValue(explorer);
  });

  it("loads the protected implementation route through the published repository", async () => {
    const markup = await renderPage();
    expect(getExplorerMock).toHaveBeenCalledWith("ifly-737-max-8-msfs-2024");
    expect(markup).toContain("Boeing 737 MAX 8");
    expect(markup).toContain("Cockpit Explorer");
  });

  it("rejects malformed and unknown implementation slugs", async () => {
    await expect(renderPage("invalid slug")).rejects.toThrow("NEXT_NOT_FOUND");
    getExplorerMock.mockResolvedValue(null);
    await expect(renderPage("unknown-implementation")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders truthful absent, empty, and provider-failure states", async () => {
    getExplorerMock.mockResolvedValue(null);
    expect(await renderPage()).toContain("Published cockpit content is not available yet");

    getExplorerMock.mockResolvedValue({ ...explorer, areas: [] });
    expect(await renderPage()).toContain("No published cockpit areas are available");

    getExplorerMock.mockRejectedValue(new Error("provider failure"));
    expect(await renderPage()).toContain("Cockpit Explorer is temporarily unavailable");
  });
});
