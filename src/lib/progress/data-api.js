import "server-only";

import { auth } from "../auth/server";

export class ProgressAccessError extends Error {
  constructor(code) {
    super(code);
    this.name = "ProgressAccessError";
    this.code = code;
  }
}

function dataApiBaseUrl() {
  const value = process.env.NEON_DATA_API_URL?.trim();
  if (!value) throw new ProgressAccessError("CONFIGURATION");
  return value.replace(/\/$/, "");
}

async function authenticatedToken() {
  const { data: sessionData } = await auth.getSession();
  if (!sessionData?.user) throw new ProgressAccessError("UNAUTHENTICATED");

  const tokenResult = await auth.token();
  const token = tokenResult?.data?.token;
  if (!token || tokenResult.error) throw new ProgressAccessError("UNAUTHENTICATED");
  return token;
}

async function dataApiRequest(resource, { method = "GET", body, prefer } = {}) {
  const token = await authenticatedToken();
  const response = await fetch(`${dataApiBaseUrl()}/${resource}`, {
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Profile": "public",
      "Content-Profile": "public",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ProgressAccessError(
      response.status === 401 ? "UNAUTHENTICATED" : "PERSISTENCE",
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

function firstRow(value) {
  return Array.isArray(value) ? value[0] || null : value;
}

function camelProgress(row) {
  if (!row) return null;
  return {
    id: row.id || row.journey_progress_id,
    journeyId: row.journey_id,
    procedureId: row.procedure_id,
    currentSectionId: row.current_journey_section_id,
    currentStepId: row.current_procedure_step_id || row.current_step_id,
    status: row.progress_status,
    procedureStatus: row.procedure_status,
    journeyStatus: row.journey_status,
    mode: row.guide_mode,
    stalePosition: row.stale_position || false,
    lastActivityAt: row.last_activity_at,
  };
}

export async function getGuideProgress(journeyId, procedureId) {
  const journeyQuery = new URLSearchParams({
    journey_id: `eq.${journeyId}`,
    select: "id,journey_id,progress_status,current_journey_section_id,current_procedure_step_id,guide_mode,last_activity_at",
    limit: "1",
  });
  const procedureQuery = new URLSearchParams({
    procedure_id: `eq.${procedureId}`,
    select: "id,procedure_id,progress_status,current_step_id,last_activity_at",
    limit: "1",
  });
  const stepQuery = new URLSearchParams({
    procedure_id: `eq.${procedureId}`,
    select: "procedure_step_id,progress_status",
  });

  const [journeyRows, procedureRows, stepRows] = await Promise.all([
    dataApiRequest(`user_journey_progress?${journeyQuery}`),
    dataApiRequest(`user_procedure_progress?${procedureQuery}`),
    dataApiRequest(`user_step_progress?${stepQuery}`),
  ]);

  return {
    journey: camelProgress(firstRow(journeyRows)),
    procedure: camelProgress(firstRow(procedureRows)),
    steps: (stepRows || []).map((row) => ({
      stepId: row.procedure_step_id,
      status: row.progress_status,
    })),
  };
}

export async function startGuideProgress(journeyId, procedureId) {
  const result = await dataApiRequest("rpc/cockpitpath_start_guide", {
    method: "POST",
    body: { p_journey_id: journeyId, p_procedure_id: procedureId },
  });
  return camelProgress(firstRow(result));
}

export async function setGuidePosition(journeyId, stepId, mode = null) {
  const result = await dataApiRequest("rpc/cockpitpath_set_guide_position", {
    method: "POST",
    body: {
      p_journey_id: journeyId,
      p_procedure_step_id: stepId,
      p_guide_mode: mode,
    },
  });
  return camelProgress(firstRow(result));
}

export async function recordStepProgress(journeyId, stepId, outcome) {
  const result = await dataApiRequest("rpc/cockpitpath_record_step_progress", {
    method: "POST",
    body: {
      p_journey_id: journeyId,
      p_procedure_step_id: stepId,
      p_outcome: outcome,
    },
  });
  return camelProgress(firstRow(result));
}
