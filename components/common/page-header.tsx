import { FC } from "react";
import { Rocket } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 flex items-center gap-4">
        <Rocket className="h-8 w-8 md:h-14 md:w-14 text-primary mt-2" />
        {title}
      </h1>
      {description && (
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;