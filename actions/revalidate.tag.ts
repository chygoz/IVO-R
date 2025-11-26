"use server";

import { revalidateTag as revalidate, revalidatePath } from "next/cache";

async function revalidateTag(name: string) {
  revalidate(name, "layout");
}

export default revalidateTag;

export async function revalidatePage(name: string) {
  revalidatePath(name, "layout");
}
