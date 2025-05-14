import { getUserCredits } from "@/app/features/user-credits";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Coins } from "lucide-react";

export default async function HeaderCredits() {
  const { userId } = await auth();
  if (!userId) return null;

  const { credits } = await getUserCredits(userId);

  return (
    <div
      className="flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-300 via-pink-200 to-purple-200 shadow-md mr-2 transition-all duration-200  hover:shadow-md cursor-default min-w-[60px]"
      title="AI要約などに使える残りクレジットです"
    >
      <div className="flex items-center gap-1">
        <Coins className="w-5 h-5 text-yellow-500 drop-shadow" />
        <span className="text-lg font-bold text-purple-700">
          {credits !== null ? credits : "-"}
        </span>
      </div>
      <span className="text-[10px] text-purple-700 font-semibold tracking-wide -mt-1">
        クレジット
      </span>
    </div>
  );
}
