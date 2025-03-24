import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Zap, BookOpen, Globe, MonitorSmartphone } from "lucide-react";
import { Source } from "@/lib/types/article";

interface SourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
  sources: Source[];
}

export const SourceSelector: FC<SourceSelectorProps> = ({
  selectedSource,
  onSourceChange,
  sources,
}) => {
  const sourceIcons = {
    all: { icon: Globe, color: "bg-gradient-to-r from-blue-500 to-purple-500" },
    zenn: { icon: Zap, color: "bg-[#3EA8FF]" },
    qiita: { icon: BookOpen, color: "bg-[#55C500]" },
    hackernews: { icon: MonitorSmartphone, color: "bg-[#FF6600]" },
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        key="all"
        variant={selectedSource === "all" ? "default" : "outline"}
        onClick={() => onSourceChange("all")}
        className={`flex items-center gap-2 ${
          selectedSource === "all"
            ? sourceIcons.all.color + " text-white hover:opacity-90"
            : ""
        }`}
      >
        <Globe className="h-4 w-4" />
        すべて
      </Button>

      {sources.map((source) => {
        const sourceInfo = sourceIcons[
          source.name as keyof typeof sourceIcons
        ] || { icon: Globe, color: "" };
        const Icon = sourceInfo.icon;
        return (
          <Button
            key={source.id}
            variant={selectedSource === source.name ? "default" : "outline"}
            onClick={() => onSourceChange(source.name)}
            className={`flex items-center gap-2 ${
              selectedSource === source.name
                ? sourceInfo.color + " text-white hover:opacity-90"
                : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            {source.label}
          </Button>
        );
      })}
    </div>
  );
};
