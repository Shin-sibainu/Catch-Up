"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Gift, ArrowRight } from "lucide-react";

export default function SubscriptionSuccessModal() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const credits = searchParams.get("credits");
  const plan = searchParams.get("plan") || "BASIC";
  const isTest = searchParams.get("test") === "modal";

  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const router = useRouter();

  // テスト用のダミーデータ
  const displayCredits = isTest ? "80" : credits;
  const displayPlan = isTest ? "PRO" : plan;

  useEffect(() => {
    // 既に表示済みの場合は何もしない
    if (hasShown) {
      return;
    }

    if ((success && credits) || isTest) {
      setIsOpen(true);
      setHasShown(true);
    }
  }, [success, credits, isTest, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
    // URLをクリーンにする（テストパラメータや決済パラメータを削除）
    router.replace("/", { scroll: false });
  };

  const handleOpenChange = (open: boolean) => {
    // ユーザーが明示的に閉じた場合のみ閉じる
    if (!open) {
      setIsOpen(false);
    }
  };

  const getPlanDisplayName = (planName: string) => {
    switch (planName) {
      case "BASIC":
        return "ベーシック";
      case "PRO":
        return "プロ";
      case "ENTERPRISE":
        return "エンタープライズ";
      default:
        return planName;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "BASIC":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "PRO":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "ENTERPRISE":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div style={{ zIndex: 10000 }}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md relative overflow-hidden"
          style={{
            position: "fixed",
            top: "50vh",
            left: "50vw",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            margin: 0,
          }}
        >
          {/* 背景装飾 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <DialogTitle className="text-2xl font-bold text-gray-900">
              🎉 {isTest ? "テスト表示" : "決済完了！"}
            </DialogTitle>

            <div className="space-y-3">
              <p className="text-gray-600">
                サブスクリプションの決済が正常に完了しました
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Badge
                    className={`${getPlanColor(
                      displayPlan
                    )} text-white px-3 py-1`}
                  >
                    {getPlanDisplayName(displayPlan)}プラン
                  </Badge>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  <span className="text-lg font-semibold text-gray-800">
                    {displayCredits}クレジット
                  </span>
                  <span className="text-gray-600">が付与されました</span>
                  <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-medium">
                    今すぐAI要約機能をお試しください！
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col space-y-3 mt-6">
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <span>記事を探しに行く</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              クレジットは毎月自動で更新されます
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
