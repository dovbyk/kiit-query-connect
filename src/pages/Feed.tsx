
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import QueryCard from "@/components/QueryCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Feed = () => {
  const { currentUser } = useAuth();
  const { queries } = useQueries();
  const { getSubjectById } = useCommunities();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter queries to show only those from the user's community
  const communityQueries = queries.filter(query => {
    if (!currentUser) return false;
    const subject = getSubjectById(query.subjectId);
    return subject && currentUser.communities.includes(subject.communityId);
  });
  
  // Filter queries based on search
  const filteredQueries = communityQueries.filter(query => {
    if (searchTerm === "") return true;
    
    const subject = getSubjectById(query.subjectId);
    return subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           query.content.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-gradient-primary fade-in">Query Feed</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* Simple Search Bar */}
        <div className="relative w-full mb-6 fade-in-up">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 pr-4 py-6 text-lg"
            placeholder="Search queries or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Teacher's Share Materials Link */}
        {currentUser?.role === "teacher" && (
          <div className="mb-6 text-center fade-in">
            <Button 
              onClick={() => navigate("/share-materials")}
              className="bg-primary hover:bg-primary/90"
            >
              Share Educational Materials
            </Button>
          </div>
        )}

        {/* Queries List */}
        <div className="space-y-4">
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query, index) => (
              <div key={query.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <QueryCard query={query} />
              </div>
            ))
          ) : (
            <div className="text-center py-10 glass-morphism rounded-xl shadow fade-in">
              <p className="text-muted-foreground">
                {searchTerm ? "No queries match your search." : "No queries available in your community."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
