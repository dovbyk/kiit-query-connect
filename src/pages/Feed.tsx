
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueries } from "@/context/QueryContext";
import { useCommunities } from "@/context/CommunityContext";
import { useNavigate } from "react-router-dom";
import QueryCard from "@/components/QueryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Feed = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { queries } = useQueries();
  const { communities, getSubjectById, getAllSubjects } = useCommunities();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const allSubjects = getAllSubjects();

  useEffect(() => {
    console.log("Feed component mounting");
    console.log("Auth state in Feed:", { isAuthenticated, currentUser });
    console.log("Queries available:", queries);
    console.log("Communities:", communities);
    
    // If not authenticated, redirect to login
    if (!currentUser) {
      console.log("No current user, redirecting to login");
      navigate("/login");
    } else {
      console.log("User authenticated, showing feed");
      setLoading(false);
    }
  }, [currentUser, navigate]);

  // Filter queries based on the user's communities
  const userCommunityQueries = queries.filter(query => {
    if (!currentUser) return false;
    const subject = getSubjectById(query.subjectId);
    return subject && currentUser.communities.includes(subject.communityId);
  });
  
  // Filter queries based on search and subject filter
  const filterQueries = (queryList) => {
    return queryList.filter(query => {
      const matchesSearch = searchTerm === "" || 
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        query.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = selectedSubject === "" || query.subjectId === selectedSubject;
      
      return matchesSearch && matchesSubject;
    });
  };
  
  const filteredUserQueries = filterQueries(userCommunityQueries);
  const filteredAllQueries = filterQueries(queries);

  // If we're still checking authentication or loading, show a loading state
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
        {/* Global Search Bar */}
        <Popover open={openSearch} onOpenChange={setOpenSearch}>
          <PopoverTrigger asChild>
            <div className="relative w-full mb-6 fade-in-up">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 pr-4 py-6 text-lg"
                placeholder="Search all queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setOpenSearch(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search queries..." value={searchTerm} onValueChange={setSearchTerm} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {allSubjects.map((subject) => (
                    <CommandItem
                      key={subject.id}
                      onSelect={() => {
                        setSelectedSubject(subject.id);
                        setOpenSearch(false);
                      }}
                    >
                      {subject.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Search and Filter Section */}
        <div className="glass-morphism p-4 rounded-lg mb-6 fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Filter current view..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {allSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="for-you" className="scale-in">
          <TabsList className="mb-8 glass-morphism border border-primary/30 shadow">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="all">All Queries</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            {filteredUserQueries.length > 0 ? (
              filteredUserQueries.map((query, index) => (
                <div key={query.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <QueryCard query={query} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 glass-morphism rounded-xl shadow fade-in">
                <p className="text-muted-foreground">No queries for your communities yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {filteredAllQueries.length > 0 ? (
              filteredAllQueries.map((query, index) => (
                <div key={query.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <QueryCard query={query} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 glass-morphism rounded-xl shadow fade-in">
                <p className="text-muted-foreground">No queries match your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feed;
