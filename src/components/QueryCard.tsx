
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
    <div className="query-card mb-4">
      <div className="flex items-start">
        <Avatar className="mr-4">
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
          
          <Link to={`/query/${query.id}`} className="block mt-2">
            <h3 className="text-xl font-bold">{query.title}</h3>
            <p className="mt-2">{query.content}</p>
          </Link>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={() => upvoteQuery(query.id)}
                disabled={!currentUser}
              >
                <ThumbsUp className="h-4 w-4" /> {query.upvotes}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1" 
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
