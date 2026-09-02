"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth";

async function assertAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Não autorizado.");
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function setTestimonialStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function toggleFeatured(id: string, featured: boolean) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function setGoogleHidden(reviewId: string, hidden: boolean) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = hidden
    ? await admin.from("hidden_google_reviews").upsert({ review_id: reviewId })
    : await admin.from("hidden_google_reviews").delete().eq("review_id", reviewId);
  if (error) throw new Error(error.message);
  revalidateAll();
}
