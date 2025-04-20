
import { Comment } from "@/types";
import { users } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const author = users.find(user => user.id === comment.authorId);
  
  return (
    <div className="py-3 border-t border-border">
      <div className="flex items-start">
        <Avatar className="mr-3 h-6 w-6">
          <AvatarImage src={author?.avatar} alt={author?.name} />
          <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{author?.name}</p>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
