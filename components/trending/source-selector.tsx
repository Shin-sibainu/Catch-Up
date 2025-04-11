"use client";

import { FC } from "react";
import { Source } from "@/lib/types/article";
import { cn } from "@/lib/utils";
import { Zap, BookOpen, Globe, MonitorSmartphone } from "lucide-react";

interface SourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

const sources: (Source & { color: string; icon: any })[] = [
  {
    id: 0,
    name: "all",
    label: "すべて",
    enabled: true,
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
    icon: Globe,
  },
  {
    id: 1,
    name: "zenn",
    label: "Zenn",
    enabled: true,
    color: "bg-[#3EA8FF]",
    icon: Zap,
  },
  {
    id: 2,
    name: "qiita",
    label: "Qiita",
    enabled: true,
    color: "bg-[#55C500]",
    icon: BookOpen,
  },
  {
    id: 3,
    name: "hackernews",
    label: "Hacker News",
    enabled: true,
    color: "bg-[#FF6600]",
    icon: MonitorSmartphone,
  },
];

export const SourceSelector: FC<SourceSelectorProps> = ({
  selectedSource,
  onSourceChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => {
        const Icon = source.icon;
        return (
          <button
            key={source.id}
            onClick={() => onSourceChange(source.name)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 border",
              selectedSource === source.name
                ? cn(source.color, "text-white shadow-md scale-105")
                : "bg-muted hover:bg-muted/80 hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={!source.enabled}
          >
            <Icon className="h-4 w-4" />
            {source.label}
          </button>
        );
      })}
    </div>
  );
};
