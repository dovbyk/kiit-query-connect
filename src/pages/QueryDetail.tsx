
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import ResponseCard from "@/components/ResponseCard";
import CommentCard from "@/components/CommentCard";
import { formatDistanceToNow } from "date-fns";

const QueryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { currentUser, isAuthenticated } = useAuth();
  const { getQueryById, addComment, addResponse, upvoteQuery, downvoteQuery } = useQueries();
  const { getSubjectById } = useCommunities();
  
  const [newComment, setNewComment] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState<"pdf" | "image">("pdf");
  
  const query = id ? getQueryById(id) : undefined;
  
  useEffect(() => {
    if (!query) {
      navigate("/feed");
    }
  }, [query, navigate]);
  
  if (!query) {
    return null;
  }
  
  const subject = getSubjectById(query.subjectId);
  const author = users.find(user => user.id === query.authorId);
  
  const handleAddComment = () => {
    if (!isAuthenticated || !newComment.trim()) return;
    
    addComment(query.id, currentUser!.id, newComment);
    setNewComment("");
  };
  
  const handleAddResponse = () => {
    if (!isAuthenticated || !resourceUrl.trim() || currentUser?.role !== "teacher") return;
    
    addResponse(query.id, currentUser!.id, resourceUrl, resourceType);
    setResourceUrl("");
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start mb-4">
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
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{query.title}</h1>
            <p className="mb-6">{query.content}</p>
            
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
              
              <div className="flex items-center gap-1 ml-auto">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{query.comments.length} comments</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {query.responses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Teacher Responses</h2>
            {query.responses.map(response => (
              <ResponseCard key={response.id} response={response} />
            ))}
          </div>
        )}
        
        {currentUser?.role === "teacher" && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Add Response</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resourceUrl">Resource URL (PDF or Image)</Label>
                  <Input 
                    id="resourceUrl" 
                    placeholder="Enter URL to your response document" 
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <Select 
                    value={resourceType} 
                    onValueChange={(value) => setResourceType(value as "pdf" | "image")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleAddResponse} disabled={!resourceUrl.trim()}>
                  Add Response
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div>
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          
          {isAuthenticated && (
            <div className="mb-6 flex gap-4">
              <Textarea 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Comment
              </Button>
            </div>
          )}
          
          {query.comments.length > 0 ? (
            <div className="space-y-0">
              {query.comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;
