import { fetchAPI } from "./config";

type Config = {
  oldPassword: string;
  password: string;
  email: string;
};

async function changeUserDefaultPassword({
  oldPassword,
  password,
  email,
}: Config) {
  const res = await fetchAPI({
    method: "POST",
    url: "/api/v1/auth/password/default",
    body: { email, oldPassword, password },
  });

  // Handle response errors or return the response
  if (res.error) {
    throw Error(res.details);
  }

  return res;
}

export default changeUserDefaultPassword;
