
import { users } from "@/data/mockData";
import { User } from "@/types";
import { Award, Star } from "lucide-react";

export default function TopTeachersCard() {
  // Filter only teachers with responseCount
  const topTeachers = users
    .filter(user => user.role === "teacher" && typeof user.responseCount === "number")
    .sort((a, b) => (b.responseCount ?? 0) - (a.responseCount ?? 0))
    .slice(0, 5) as User[];

  return (
    <div className="rounded-xl glass-morphism p-4 mb-6 shadow-lg bg-card/60 animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-4">
        <Award className="text-yellow-400 h-5 w-5" />
        <span className="text-lg font-bold text-primary">Top Teachers</span>
      </div>
      <ol className="space-y-2">
        {topTeachers.map((teacher, idx) => (
          <li key={teacher.id} className="flex items-center gap-2 py-1">
            <span className={`font-medium ${idx < 3 ? "text-accent" : "text-foreground/90"}`}>{idx + 1}.</span>
            <img
              src={teacher.avatar || "/placeholder.svg"}
              alt={teacher.name}
              className="h-6 w-6 rounded-full border border-border object-cover"
            />
            <span className="truncate flex-1 text-sm">{teacher.name}</span>
            <span className="text-xs flex items-center gap-1 text-muted-foreground"><Star className="w-4 h-4 text-yellow-500" />{teacher.responseCount}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
