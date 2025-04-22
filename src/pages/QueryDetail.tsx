import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import ResponseCard from "@/components/ResponseCard";
import { formatDistanceToNow } from "date-fns";
import TeacherResourceUpload from "@/components/TeacherResourceUpload";
import CommentsSection from "@/components/CommentsSection";

const QueryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated } = useAuth();
  const { getQueryById, addComment, addResponse, upvoteQuery, downvoteQuery } =
    useQueries();
  const { getSubjectById } = useCommunities();

  const query = id ? getQueryById(id) : undefined;

  useEffect(() => {
    if (!query) {
      navigate("/feed");
    }
    
    // Add console logs for debugging
    console.log("Query detail loaded:", { query, currentUser, isAuthenticated });
  }, [query, navigate, currentUser, isAuthenticated]);

  if (!query) {
    return null;
  }

  const subject = getSubjectById(query.subjectId);
  const author = users.find(user => user.id === query.authorId);

  // For passing handlers down
  const handleAddComment = (comment: string) => {
    if (!isAuthenticated || !comment.trim()) return;
    addComment(query.id, currentUser!.id, comment);
  };

  const handleAddResponse = (resourceUrl: string, resourceType: "pdf" | "image") => {
    if (!isAuthenticated || !resourceUrl.trim() || currentUser?.role !== "teacher") return;
    addResponse(query.id, currentUser!.id, resourceUrl, resourceType);
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6 fade-in">
          <CardContent className="pt-6">
            <div className="flex items-start mb-4">
              <div className="mr-4 flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="upvote-button"
                  onClick={() => upvoteQuery(query.id)}
                  disabled={!currentUser}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className="text-sm font-bold my-1">{query.upvotes - query.downvotes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="downvote-button"
                  onClick={() => downvoteQuery(query.id)}
                  disabled={!currentUser}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>
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
                  {subject && <Badge variant="secondary">{subject.name}</Badge>}
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">{query.title}</h1>
            <p className="mb-4">{query.content}</p>
            {query.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden border border-border">
                <img
                  src={query.imageUrl}
                  alt="Query attachment"
                  className="max-h-96 w-auto object-contain mx-auto"
                />
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{query.comments.length} comments</span>
            </div>
          </CardContent>
        </Card>

        {currentUser?.role === "teacher" && (
          <TeacherResourceUpload
            onAddResponse={handleAddResponse}
          />
        )}

        {query.responses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Teacher Responses</h2>
            {query.responses.map((response, index) => (
              <div key={response.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ResponseCard response={response} />
              </div>
            ))}
          </div>
        )}

        <CommentsSection
          comments={query.comments}
          isAuthenticated={isAuthenticated}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
};

export default QueryDetail;
