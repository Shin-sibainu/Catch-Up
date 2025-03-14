import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  BookOpen, 
  Globe,
  MonitorSmartphone
} from "lucide-react";

interface SourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export const SourceSelector: FC<SourceSelectorProps> = ({
  selectedSource,
  onSourceChange,
}) => {
  const sources = [
    { id: "all", name: "すべて", icon: Globe, color: "bg-gradient-to-r from-blue-500 to-purple-500" },
    { id: "zenn", name: "Zenn", icon: Zap, color: "bg-[#3EA8FF]" },
    { id: "qiita", name: "Qiita", icon: BookOpen, color: "bg-[#55C500]" },
    { id: "hackernews", name: "Hacker News", icon: MonitorSmartphone, color: "bg-[#FF6600]" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => {
        const Icon = source.icon;
        return (
          <Button
            key={source.id}
            variant={selectedSource === source.id ? "default" : "outline"}
            onClick={() => onSourceChange(source.id)}
            className={`flex items-center gap-2 ${
              selectedSource === source.id ? source.color + " text-white hover:opacity-90" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            {source.name}
          </Button>
        );
      })}
    </div>
  );
};