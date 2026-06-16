import apiClient from "./client";

export const fetchTools = async () => {
  const { data } = await apiClient.get("/tools");
  return data;
};

export const runToolRequest = async (slug, payload) => {
  const { data } = await apiClient.post(`/tools/${slug}/run`, payload);
  return data;
};
