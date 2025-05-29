"use server";

import { prisma } from "@/lib/prisma";

export async function getUserCredits(
  clerkId: string
): Promise<{ credits: number | null }> {
  const user = await prisma.users.findUnique({ where: { clerkid: clerkId } });
  return { credits: user?.credits ?? null };
}

// デバッグ用のログ機能
function logCreditOperation(operation: string, clerkId: string, details: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[CREDIT_DEBUG] ${operation}:`, {
      clerkId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }
}

export async function decrementUserCredit(
  clerkId: string
): Promise<{ success: boolean; credits?: number; error?: string }> {
  logCreditOperation("DECREMENT_START", clerkId, {});

  try {
    // トランザクションを使用して原子的操作を保証
    const result = await prisma.$transaction(
      async (tx) => {
        // 条件付き更新を使用してクレジットを減算
        // この方法により、クレジットが0以下の場合は更新されない
        const updated = await tx.users.updateMany({
          where: {
            clerkid: clerkId,
            credits: { gt: 0 }, // クレジットが0より大きい場合のみ更新
          },
          data: {
            credits: { decrement: 1 },
            usedCredits: { increment: 1 },
          },
        });

        // 更新された行数が0の場合、ユーザーが存在しないかクレジットが不足
        if (updated.count === 0) {
          // ユーザーが存在するかチェック
          const user = await tx.users.findUnique({
            where: { clerkid: clerkId },
            select: { credits: true },
          });

          if (!user) {
            throw new Error("ユーザーが見つかりません");
          } else {
            throw new Error("クレジットが不足しています");
          }
        }

        // 更新後のユーザー情報を取得
        const user = await tx.users.findUnique({
          where: { clerkid: clerkId },
          select: { credits: true },
        });

        return { success: true, credits: user?.credits ?? 0 };
      },
      {
        // トランザクションのタイムアウトを設定（デフォルト5秒）
        timeout: 10000,
        // 分離レベルを設定（PostgreSQLの場合）
        isolationLevel: "ReadCommitted",
      }
    );

    logCreditOperation("DECREMENT_SUCCESS", clerkId, {
      finalCredits: result.credits,
    });
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラー";

    logCreditOperation("DECREMENT_ERROR", clerkId, {
      error: errorMessage,
    });

    // クレジット不足の場合は現在のクレジット数も返す
    if (errorMessage === "クレジットが不足しています") {
      try {
        const user = await prisma.users.findUnique({
          where: { clerkid: clerkId },
          select: { credits: true },
        });
        return {
          success: false,
          credits: user?.credits ?? 0,
          error: errorMessage,
        };
      } catch {
        return { success: false, error: errorMessage };
      }
    }

    return { success: false, error: errorMessage };
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
