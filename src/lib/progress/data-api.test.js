import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    token: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));
vi.mock("../auth/server", () => ({ auth: authMock }));

import {
  getGuideProgress,
  ProgressAccessError,
  recordStepProgress,
} from "./data-api";

describe("progress Data API boundary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEON_DATA_API_URL = "https://data-api.example/rest/v1";
    authMock.getSession.mockResolvedValue({ data: { user: { id: "managed-user" } } });
    authMock.token.mockResolvedValue({ data: { token: "synthetic.jwt.value" }, error: null });
  });

  it("refuses progress access without an authenticated server session", async () => {
    authMock.getSession.mockResolvedValue({ data: { user: null } });
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(getGuideProgress("journey-id", "procedure-id"))
      .rejects.toEqual(expect.objectContaining({ code: "UNAUTHENTICATED" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the server-obtained JWT and never sends a caller-owned user id", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{
        current_journey_section_id: "section-id",
        current_procedure_step_id: "step-id",
        procedure_status: "IN_PROGRESS",
        journey_status: "IN_PROGRESS",
        stale_position: false,
      }],
    });

    await recordStepProgress("00000000-0000-4000-8000-000000000001", "00000000-0000-4000-8000-000000000002", "COMPLETED");

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("https://data-api.example/rest/v1/rpc/cockpitpath_record_step_progress");
    expect(request.headers.Authorization).toBe("Bearer synthetic.jwt.value");
    expect(request.body).not.toContain("user_id");
    expect(request.body).not.toContain("managed-user");
  });

  it("maps provider failures to a stable persistence error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 403 });
    await expect(recordStepProgress("journey", "step", "COMPLETED"))
      .rejects.toBeInstanceOf(ProgressAccessError);
  });
});
