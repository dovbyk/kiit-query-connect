
import { useCommunities } from "@/context/CommunityContext";
import { useAuth } from "@/context/AuthContext";
import { BookOpen } from "lucide-react";

export default function TopSubjectsCard() {
  const { currentUser } = useAuth();
  const { getSubjectsByCommunitiesIds } = useCommunities();

  // Only in user's communities
  const subjects = currentUser
    ? getSubjectsByCommunitiesIds(currentUser.communities)
    : [];

  // Top 10 (sorted alphabetically now, but logic can be improved if "top" is defined by activity, etc.)
  const topSubjects = subjects
    .slice(0, 10);

  return (
    <div className="rounded-xl glass-morphism p-4 mb-6 shadow-lg bg-card/60 animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-primary h-5 w-5" />
        <span className="text-lg font-bold text-primary">Top Subjects</span>
      </div>
      <ol className="space-y-2">
        {topSubjects.map((subject, idx) => (
          <li key={subject.id} className="flex items-center gap-2 py-1">
            <span className={`font-medium text-accent`}>{idx + 1}.</span>
            <span className="truncate">{subject.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
