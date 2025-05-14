import { toast } from "@/hooks/use-toast";

export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    // 許可されたドメインのリスト
    const allowedDomains = ["zenn.dev", "qiita.com", "news.ycombinator.com"];
    return allowedDomains.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

export const openExternalUrl = (url: string): void => {
  if (!isValidUrl(url)) {
    console.error("Invalid or unauthorized URL:", url);
    toast({
      variant: "destructive",
      description:
        "無効なURLです。許可されていないドメインへのアクセスは制限されています。",
    });
    return;
  }

  try {
    // 安全な属性を付与して新しいウィンドウで開く
    const newWindow = window.open();
    if (newWindow) {
      newWindow.opener = null;
      newWindow.location.href = url;
    } else {
      toast({
        description:
          "ポップアップがブロックされている可能性があります。ブラウザの設定を確認してください。",
      });
    }
  } catch (error) {
    console.error("Error opening URL:", error);
    toast({
      variant: "destructive",
      description: "URLを開く際にエラーが発生しました。",
    });
  }
};
