import {
  MajorItem,
  DEFAULT_FAQ,
  DEFAULT_PARTNERS,
  DEFAULT_MAJORS,
  formatPhoneNumber
} from "../types";

export async function fetchCurrentConfigService() {
  const res = await fetch("http://localhost:5000/api/config");
  const json = await res.json();
  const config = (json.success && json.data) ? json.data : {};

  const savedDraft = localStorage.getItem("ppdb_ui_editor_draft");
  let draft: any = null;
  if (savedDraft) {
    try {
      draft = JSON.parse(savedDraft);
    } catch (_) {}
  }

  const activeConfig = draft ? { ...config, ...draft } : config;
  return { activeConfig, hasDraft: !!draft };
}

export async function fetchRevisionsService(adminToken: string | null) {
  const token = adminToken || localStorage.getItem("ppdb_admin_token");
  const res = await fetch("http://localhost:5000/api/config/revisions", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function saveAllConfigsService(
  configsPayload: any,
  changeDescription: string,
  adminToken: string | null
) {
  const token = adminToken || localStorage.getItem("ppdb_admin_token");
  const res = await fetch("http://localhost:5000/api/config/save-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      configs: configsPayload,
      description: changeDescription
    })
  });
  return await res.json();
}

export async function restoreRevisionService(revId: number, adminToken: string | null) {
  const token = adminToken || localStorage.getItem("ppdb_admin_token");
  const res = await fetch("http://localhost:5000/api/config/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ revisionId: revId })
  });
  return await res.json();
}
