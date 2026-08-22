const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// STANDARD JOB SEARCH
// ============================================================

export async function searchJobs(params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/api/jobs?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch jobs: ${response.status}`
    );
  }

  return response.json();
}


// ============================================================
// AI SEMANTIC JOB SEARCH
// ============================================================

export async function semanticSearchJobs({
  query,
  skill = "",
  location = "",
  experience = "",
  limit = 20,
}) {
  const queryParams = new URLSearchParams();

  queryParams.append("q", query);
  queryParams.append("limit", limit);

  if (skill) {
    queryParams.append("skill", skill);
  }

  if (location) {
    queryParams.append("location", location);
  }

  if (
    experience !== "" &&
    experience !== null &&
    experience !== undefined
  ) {
    queryParams.append(
      "experience",
      experience
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/jobs/semantic-search?${queryParams.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Semantic search failed: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


// ============================================================
// AI ASSISTANT SEARCH
// ============================================================

export async function assistantSearch({
  query,
  limit = 10,
}) {
  const queryParams = new URLSearchParams();

  queryParams.append("q", query);
  queryParams.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/api/assistant?${queryParams.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Assistant search failed: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


// ============================================================
// GET SINGLE JOB
// ============================================================

export async function getJob(jobId) {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/${jobId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch job: ${response.status}`
    );
  }

  return response.json();
}