/* eslint-env node */

import { getStore } from "@netlify/blobs";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const EMAIL_COOLDOWN_MS = 5 * 60 * 1000;

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(body),
});

const normalizeProgressState = (raw) => {
  if (!raw || typeof raw !== "object") {
    return { data: {}, updatedAt: 0 };
  }

  const data = raw.data && typeof raw.data === "object" ? raw.data : {};
  const updatedAt = Number(raw.updatedAt) || 0;

  return { data, updatedAt };
};

const countChecked = (data) =>
  Object.values(data || {}).filter((value) => Boolean(value)).length;

const diffKeys = (beforeData, afterData) => {
  const keys = new Set([
    ...Object.keys(beforeData || {}),
    ...Object.keys(afterData || {}),
  ]);

  let changed = 0;

  keys.forEach((key) => {
    if (Boolean(beforeData?.[key]) !== Boolean(afterData?.[key])) {
      changed += 1;
    }
  });

  return changed;
};

const sendEmailNotification = async ({
  studentId,
  changedCount,
  checkedCount,
  totalTasks,
  updatedAt,
}) => {
  const resendApiKey = globalThis.process?.env?.RESEND_API_KEY;
  const adminEmail = globalThis.process?.env?.ADMIN_EMAIL;

  if (!resendApiKey || !adminEmail) {
    return;
  }

  const completedPct =
    totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0;

  const text = [
    "Ninja progress update detected.",
    `Student: ${studentId}`,
    `Changed checkboxes: ${changedCount}`,
    `Completed tasks: ${checkedCount}/${totalTasks}`,
    `Progress: ${completedPct}%`,
    `Updated at: ${new Date(updatedAt).toISOString()}`,
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        globalThis.process?.env?.FROM_EMAIL ||
        "Midterm Ninja <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "Midterm Ninja Progress Update",
      text,
    }),
  });
};

export default async (request) => {
  const method = request.httpMethod;
  const progressStore = getStore("ninja-progress");
  const metaStore = getStore("ninja-progress-meta");

  if (method === "GET") {
    const studentId = request.queryStringParameters?.studentId || "brother";
    const key = `${studentId}.json`;

    const saved =
      (await progressStore.get(key, { type: "json" })) || {
        progressState: { data: {}, updatedAt: 0 },
      };

    return jsonResponse(200, {
      studentId,
      progressState: normalizeProgressState(saved.progressState),
    });
  }

  if (method === "POST") {
    let parsed;

    try {
      parsed = JSON.parse(request.body || "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body" });
    }

    const studentId = parsed.studentId || "brother";
    const incoming = normalizeProgressState(parsed.progressState);
    const totalTasks = Number(parsed.totalTasks) || 0;
    const key = `${studentId}.json`;

    const existing =
      (await progressStore.get(key, { type: "json" })) || {
        progressState: { data: {}, updatedAt: 0 },
      };
    const current = normalizeProgressState(existing.progressState);

    // Ignore stale writes from older browser tabs.
    if (incoming.updatedAt <= current.updatedAt) {
      return jsonResponse(200, {
        ok: true,
        ignored: true,
        progressState: current,
      });
    }

    await progressStore.setJSON(key, {
      studentId,
      progressState: incoming,
      savedAt: Date.now(),
    });

    const changedCount = diffKeys(current.data, incoming.data);
    const checkedCount = countChecked(incoming.data);

    const metaKey = `${studentId}-notification.json`;
    const meta =
      (await metaStore.get(metaKey, { type: "json" })) || {
        lastEmailAt: 0,
      };

    const now = Date.now();
    const canSendEmail = now - (Number(meta.lastEmailAt) || 0) > EMAIL_COOLDOWN_MS;

    if (changedCount > 0 && canSendEmail) {
      try {
        await sendEmailNotification({
          studentId,
          changedCount,
          checkedCount,
          totalTasks,
          updatedAt: incoming.updatedAt,
        });

        await metaStore.setJSON(metaKey, { lastEmailAt: now });
      } catch {
        // Keep progress saving successful even if email fails.
      }
    }

    return jsonResponse(200, {
      ok: true,
      progressState: incoming,
      changedCount,
      checkedCount,
    });
  }

  return jsonResponse(405, { error: "Method not allowed" });
};
