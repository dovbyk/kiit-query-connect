
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import QueryCard from "@/components/QueryCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Feed = () => {
  const { currentUser } = useAuth();
  const { queries, teacherResources } = useQueries();
  const { getSubjectById } = useCommunities();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, redirecting to login");
      navigate("/login");
    } else {
      console.log("User authenticated, showing feed");
      setLoading(false);
    }
  }, [currentUser, navigate]);

  // Create combined feed of queries and resources
  // Ensure we have arrays before trying to map them
  const queriesArray = queries || [];
  const resourcesArray = teacherResources || [];
  
  const allItems = [
    ...queriesArray.map(q => ({ ...q, type: 'query' as const })),
    ...resourcesArray.map(r => ({
      id: r.id,
      title: r.title,
      content: r.description,
      subjectId: 'educational-resource', // Special subject ID for resources
      authorId: r.teacherId,
      createdAt: r.createdAt,
      type: 'resource' as const,
      fileUrl: r.fileUrl,
      fileType: r.fileType,
      upvotes: 0,
      downvotes: 0,
      responses: [],
      comments: []
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter items to show only those from user's community
  const communityItems = allItems.filter(item => {
    if (!currentUser) return false;
    if (item.type === 'resource') return true; // Always show educational resources
    const subject = getSubjectById(item.subjectId);
    return subject && currentUser.communities.includes(subject.communityId);
  });
  
  // Filter based on search and active tab
  const filteredItems = communityItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type === 'query' && 
       getSubjectById(item.subjectId)?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter based on active tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "queries") return item.type === 'query' && matchesSearch;
    if (activeTab === "resources") return item.type === 'resource' && matchesSearch;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <div className="max-w-md mx-auto glass-morphism p-10 rounded-xl">
          <p className="text-lg">Loading feed...</p>
          <div className="mt-4 h-2 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-start mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Community Feed</h1>
          <p className="text-muted-foreground">Discover queries and resources from your communities</p>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="relative w-full mb-8 fade-in-up">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 pr-4 py-6 bg-card/60 backdrop-blur-sm text-lg border-primary/20 shadow-sm"
                placeholder="Search queries, subjects, resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 hover:bg-background/30"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for filtering */}
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full mb-6 fade-in-up" 
          style={{ animationDelay: '0.2s' }}
        >
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-card/60 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
              All
            </TabsTrigger>
            <TabsTrigger value="queries" className="data-[state=active]:bg-primary/10">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Queries</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary/10">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Resources</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter stats */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Showing {filteredItems.length} items</span>
          </div>
          {searchTerm && (
            <Badge variant="outline" className="bg-primary/5">
              Search: "{searchTerm}"
            </Badge>
          )}
        </div>

        {/* Queries List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="fade-in-up" 
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <QueryCard query={item} />
              </div>
            ))
          ) : (
            <div className="text-center py-10 glass-morphism rounded-xl shadow-md backdrop-blur-xl fade-in bg-card/60">
              <p className="text-muted-foreground">
                {searchTerm ? "No items match your search." : "No items available in your community."}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 border-primary/30 hover:bg-primary/10"
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
