
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AskQuery = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser, isAuthenticated } = useAuth();
  const { createQuery } = useQueries();
  const { getSubjectsByCommunitiesIds } = useCommunities();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "student") {
      navigate("/");
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const subjects = currentUser ? getSubjectsByCommunitiesIds(currentUser.communities) : [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }
    
    setIsLoading(true);
    
    if (currentUser) {
      createQuery(title, content, selectedSubject, currentUser.id);
      setIsLoading(false);
      navigate("/feed");
    }
  };
  
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Ask a Query</CardTitle>
          <CardDescription>
            Post your academic question to get answers from teachers
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Query Title</Label>
              <Input 
                id="title" 
                placeholder="Enter a descriptive title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Query Details</Label>
              <Textarea 
                id="content" 
                placeholder="Describe your query in detail" 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={setSelectedSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Query"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AskQuery;
