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
import { ArrowUp, ArrowDown, MessageSquare, Upload, FileText } from "lucide-react";
import ResponseCard from "@/components/ResponseCard";
import CommentCard from "@/components/CommentCard";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QueryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { currentUser, isAuthenticated } = useAuth();
  const { getQueryById, addComment, addResponse, upvoteQuery, downvoteQuery, addTeacherResource } = useQueries();
  const { getSubjectById } = useCommunities();
  
  const [newComment, setNewComment] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState<"pdf" | "image">("pdf");
  
  // For teacher resource upload
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload to a storage service
    // For demo purposes, we'll simulate it with a URL
    setPdfFile(file.name);
  };
  
  const handleUploadResource = () => {
    if (!isAuthenticated || currentUser?.role !== "teacher" || !resourceTitle || !pdfFile) return;
    
    // In a real app, we would use the actual uploaded file URL
    const mockPdfUrl = `https://example.com/pdfs/${pdfFile}`;
    
    addTeacherResource(
      currentUser!.id,
      resourceTitle,
      resourceDescription,
      mockPdfUrl,
      "pdf"
    );
    
    // Reset form
    setResourceTitle("");
    setResourceDescription("");
    setPdfFile(null);
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
                  
                  {subject && (
                    <Badge variant="secondary">
                      {subject.name}
                    </Badge>
                  )}
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
          <div className="mb-8 scale-in">
            <Tabs defaultValue="response">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="response" className="flex-1">Add Response</TabsTrigger>
                <TabsTrigger value="resource" className="flex-1">Share PDF Resource</TabsTrigger>
              </TabsList>
              
              <TabsContent value="response">
                <Card>
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
                      
                      <Button onClick={handleAddResponse} disabled={!resourceUrl.trim()} className="w-full">
                        Add Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resource">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Share Educational Resource</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resourceTitle">Resource Title</Label>
                        <Input 
                          id="resourceTitle" 
                          placeholder="Enter a title for your resource" 
                          value={resourceTitle}
                          onChange={(e) => setResourceTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resourceDescription">Description</Label>
                        <Textarea 
                          id="resourceDescription" 
                          placeholder="Describe what this resource contains" 
                          value={resourceDescription}
                          onChange={(e) => setResourceDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pdfUpload">Upload PDF</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                          {pdfFile ? (
                            <div className="space-y-3">
                              <FileText className="w-10 h-10 mx-auto text-primary" />
                              <p className="text-sm">{pdfFile}</p>
                              <p className="text-xs text-muted-foreground">Click to change file</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Click to upload PDF</p>
                            </div>
                          )}
                          <Input 
                            id="pdfUpload" 
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleUploadResource} 
                        disabled={!resourceTitle || !pdfFile} 
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Share Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
        
        <div className="scale-in">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          
          {isAuthenticated && (
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <Textarea 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()} 
                className="md:self-end"
              >
                Comment
              </Button>
            </div>
          )}
          
          {query.comments.length > 0 ? (
            <div className="space-y-0">
              {query.comments.map((comment, index) => (
                <div key={comment.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <CommentCard comment={comment} />
                </div>
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
