import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
const Navbar = () => {
  const {
    currentUser,
    isAuthenticated,
    logout
  } = useAuth();
  return <nav className="bg-card py-4 border-b border-border">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold">KIIT Query Connect</Link>
        
        <div className="flex items-center gap-6">
          {isAuthenticated ? <>
              <Link to="/feed" className="hover:text-accent">Home
          </Link>
              {currentUser?.role === "student" && <Link to="/ask" className="hover:text-accent">Ask Query</Link>}
              {currentUser?.role === "teacher" && <Link to="/share-materials" className="hover:text-accent">Share Resources</Link>}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>}
        </div>
      </div>
    </nav>;
};
export default Navbar;