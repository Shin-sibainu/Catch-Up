import { FC } from "react";

interface VideoCourse {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

interface VideoCoursesProps {
  courses: VideoCourse[];
}

export const VideoCourses: FC<VideoCoursesProps> = ({ courses }) => {
  return (
    <div>
      <div>
        <p className="text-lg -mt-4">
          本アプリ「Catch Up」開発者のShinCodeが作ったWeb開発講座一覧です。
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {courses.map((course) => (
          <a
            key={course.id}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-colors hover:bg-accent"
          >
            {course.thumbnail && (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
