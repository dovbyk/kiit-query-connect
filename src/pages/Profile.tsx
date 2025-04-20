
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import QueryCard from "@/components/QueryCard";

const Profile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { queries } = useQueries();
  const { communities } = useCommunities();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) return null;
  
  const userQueries = queries.filter(query => 
    currentUser.role === "student" 
      ? query.authorId === currentUser.id 
      : query.responses.some(response => response.teacherId === currentUser.id)
  );
  
  const userCommunities = communities.filter(community => 
    currentUser.communities.includes(community.id)
  );
  
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl mb-1">{currentUser.name}</CardTitle>
              <CardDescription>{currentUser.email}</CardDescription>
              <Badge className="mt-2">{currentUser.role === "student" ? "Student" : "Teacher"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Communities</h3>
                <ul className="space-y-1">
                  {userCommunities.map(community => (
                    <li key={community.id}>{community.name}</li>
                  ))}
                </ul>
              </div>
              
              {currentUser.role === "teacher" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                  <p>Total Responses: {currentUser.responseCount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-bold mb-4">
          {currentUser.role === "student" ? "Your Queries" : "Queries You've Responded To"}
        </h2>
        
        {userQueries.length > 0 ? (
          userQueries.map(query => (
            <QueryCard key={query.id} query={query} />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {currentUser.role === "student" 
                  ? "You haven't asked any queries yet."
                  : "You haven't responded to any queries yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
