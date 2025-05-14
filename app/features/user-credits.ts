"use server";

import { prisma } from "@/lib/prisma";

export async function getUserCredits(
  clerkId: string
): Promise<{ credits: number | null }> {
  const user = await prisma.users.findUnique({ where: { clerkid: clerkId } });
  return { credits: user?.credits ?? null };
}

export async function decrementUserCredit(
  clerkId: string
): Promise<{ success: boolean; credits?: number; error?: string }> {
  const user = await prisma.users.findUnique({ where: { clerkid: clerkId } });
  if (!user) return { success: false, error: "ユーザーが見つかりません" };
  if ((user.credits ?? 0) <= 0)
    return { success: false, credits: 0, error: "クレジットが不足しています" };
  const updated = await prisma.users.update({
    where: { clerkid: clerkId },
    data: { credits: { decrement: 1 } },
  });
  return { success: true, credits: updated.credits };
}
