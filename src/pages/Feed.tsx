
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import QueryCard from "@/components/QueryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Feed = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { queries } = useQueries();
  const { communities, getSubjectById } = useCommunities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Filter queries based on the user's communities
  const userCommunityQueries = queries.filter(query => {
    const subject = getSubjectById(query.subjectId);
    return subject && currentUser?.communities.includes(subject.communityId);
  });

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-gradient-primary">Query Feed</h1>
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="for-you">
          <TabsList className="mb-8 glass-morphism border border-primary/30 shadow">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="all">All Queries</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            {userCommunityQueries.length > 0 ? (
              userCommunityQueries.map(query => (
                <QueryCard key={query.id} query={query} />
              ))
            ) : (
              <div className="text-center py-10 glass-morphism rounded-xl shadow">
                <p className="text-muted-foreground">No queries for your communities yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {queries.map(query => (
              <QueryCard key={query.id} query={query} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Feed;
