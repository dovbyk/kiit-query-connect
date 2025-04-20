
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
        KIIT Query Connect
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-foreground/80">
        A platform for KIIT University students to connect with teachers, 
        ask academic queries, and receive expert solutions.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {!isAuthenticated ? (
          <>
            <Button size="lg" onClick={() => navigate("/register")}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={() => navigate("/feed")}>
            Go to Feed
          </Button>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl w-full">
        <div className="bg-card p-6 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">Ask Queries</h3>
          <p>Post your academic questions and get answers from expert teachers.</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">Community Support</h3>
          <p>Join communities based on your branch and interact with peers.</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">Resource Sharing</h3>
          <p>Teachers share educational resources as PDFs or images.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
