
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/types";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { communities } = useCommunities();
  const navigate = useNavigate();
  
  const handleCommunityChange = (communityId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommunities([...selectedCommunities, communityId]);
    } else {
      setSelectedCommunities(selectedCommunities.filter(id => id !== communityId));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCommunities.length === 0) {
      alert("Please select at least one community");
      return;
    }
    
    setIsLoading(true);
    
    const success = await register(name, email, password, role, selectedCommunities);
    
    setIsLoading(false);
    
    if (success) {
      console.log("Registration successful, redirecting to feed");
      // Add a slight delay to ensure the auth state is updated before navigating
      setTimeout(() => {
        navigate("/feed");
      }, 500);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join KIIT Query Connect to interact with queries
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label>I am a:</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label>Join Communities:</Label>
              <div className="grid gap-2">
                {communities.map((community) => (
                  <div key={community.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`community-${community.id}`} 
                      checked={selectedCommunities.includes(community.id)} 
                      onCheckedChange={(checked) => 
                        handleCommunityChange(community.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`community-${community.id}`}>{community.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-accent underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
