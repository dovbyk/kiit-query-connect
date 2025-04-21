
import { Query } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCommunities } from "@/context/CommunityContext";
import { useQueries } from "@/context/QueryContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import { users } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

interface QueryCardProps {
  query: Query;
}

const QueryCard = ({ query }: QueryCardProps) => {
  const { upvoteQuery, downvoteQuery } = useQueries();
  const { currentUser } = useAuth();
  const { getSubjectById } = useCommunities();

  const author = users.find(user => user.id === query.authorId);
  const subject = getSubjectById(query.subjectId);

  return (
    <div className="query-card mb-6 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary/60 via-accent/60 to-secondary/60 rounded-t-xl z-0" />
      <div className="flex items-start z-10 relative">
        <Avatar className="mr-4 shadow-lg border-2 border-primary/75">
          <AvatarImage src={author?.avatar} alt={author?.name} />
          <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{author?.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
              </p>
            </div>

            {subject && (
              <Badge variant="secondary">
                {subject.name}
              </Badge>
            )}
          </div>

          <Link to={`/query/${query.id}`} className="block mt-2 hover:text-accent transition-colors">
            <h3 className="text-xl font-bold text-gradient-primary drop-shadow">{query.title}</h3>
            <p className="mt-2 text-base opacity-90">{query.content}</p>
          </Link>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 hover-scale"
                onClick={() => upvoteQuery(query.id)}
                disabled={!currentUser}
              >
                <ThumbsUp className="h-4 w-4" /> {query.upvotes}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 hover-scale"
                onClick={() => downvoteQuery(query.id)}
                disabled={!currentUser}
              >
                <ThumbsDown className="h-4 w-4" /> {query.downvotes}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{query.comments.length} comments</span>
              <span className="mx-2">•</span>
              <span className="text-sm">{query.responses.length} responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryCard;
