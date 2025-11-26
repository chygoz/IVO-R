import { fetchAPI } from "../config";
import { CreateProductInput } from "../types";
import { Submission, CLIENT_URL, SubmissionStatus } from "./utils";

export const getSubmissions = async (
  status?: string
): Promise<{
  data: { results: Submission[] };
}> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/me${status ? `?status=${status}` : ""}`,
  });

  return res;
};

export const getSubmission = async (
  submissionId: string
): Promise<{
  data: Submission | null;
}> => {
  const res = await fetchAPI({ url: `${CLIENT_URL}/${submissionId}` });

  if (res?.error) {
    return { data: null };
  }

  return res;
};

export const addSubmissionVerdict = async ({
  submissionId,
  payload,
}: {
  submissionId: string;
  payload: {
    status: SubmissionStatus;
    reason?: string;
  };
}): Promise<{
  data: Submission | null;
}> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}/${submissionId}/verdict`,
    body: payload,
  });

  return res;
};

export const resellerCancelRequest = async ({
  submissionId,
  payload,
}: {
  submissionId: string;
  payload: {
    reason?: string;
  };
}): Promise<{
  data: Submission | null;
}> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}/${submissionId}/cancelled`,
    body: payload,
  });

  return res;
};

type NewSubmissionInput = {
  type: "product" | "blank";
  category: "add" | "edit";
  items: CreateProductInput[];
};

export const addSubmission = async (
  data: NewSubmissionInput
): Promise<{
  data: Submission | null;
}> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}`,
    body: data,
  });

  return res;
};

