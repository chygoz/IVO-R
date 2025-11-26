import { CLIENT_URL } from "./util";

export const uploadImage = async (
  formData: FormData
): Promise<{ imageUrl: string; publicId: string }> => {
  const res = await fetch(`${CLIENT_URL}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed upload image");
  }

  return res.json();
};

export const deleteImage = async (
  publicId: string
): Promise<{ message: string }> => {
  const res = await fetch(`${CLIENT_URL}`, {
    method: "DELETE",
    body: JSON.stringify([publicId]),
  });

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }

  return res.json();
};
