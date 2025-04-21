
import { User, UserRole } from "@/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { users } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, communities: string[]) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Added useEffect to log the authentication state when it changes
  useEffect(() => {
    console.log("Auth state updated:", { currentUser, isAuthenticated: !!currentUser });
  }, [currentUser]);
  
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const user = users.find(u => u.email === email);
      
      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
      
      // In a real app, we'd verify the password here
      setCurrentUser(user);
      
      // Add a slight delay to ensure state updates properly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };
  
  const register = async (name: string, email: string, password: string, role: UserRole, communities: string[]) => {
    try {
      // In a real app, this would be an API call
      if (users.some(u => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "Email already in use",
          variant: "destructive"
        });
        return false;
      }
      
      const newUser: User = {
        id: `u${users.length + 1}`,
        name,
        email,
        role,
        communities,
        avatar: "/placeholder.svg",
        responseCount: role === "teacher" ? 0 : undefined
      };
      
      // In a real app, we'd add this user to the database
      users.push(newUser); // Add the new user to the mock data
      
      // Set as current user
      setCurrentUser(newUser);
      
      // Add a slight delay to ensure state updates properly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to KIIT Query Connect, ${name}!`
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
