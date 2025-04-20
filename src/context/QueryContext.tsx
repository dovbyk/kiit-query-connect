
import { Comment, Query, Response } from "@/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { queries as mockQueries } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface QueryContextType {
  queries: Query[];
  getQueryById: (id: string) => Query | undefined;
  createQuery: (title: string, content: string, subjectId: string, authorId: string) => void;
  addResponse: (queryId: string, teacherId: string, resourceUrl: string, resourceType: "pdf" | "image") => void;
  addComment: (queryId: string, authorId: string, content: string) => void;
  upvoteQuery: (queryId: string) => void;
  downvoteQuery: (queryId: string) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    // In a real app, we'd fetch from an API
    setQueries(mockQueries);
  }, []);

  const getQueryById = (id: string) => {
    return queries.find(query => query.id === id);
  };

  const createQuery = (title: string, content: string, subjectId: string, authorId: string) => {
    const newQuery: Query = {
      id: `q${queries.length + 1}`,
      title,
      content,
      subjectId,
      authorId,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      responses: [],
      comments: []
    };

    setQueries(prev => [newQuery, ...prev]);
    toast({
      title: "Query Created",
      description: "Your query has been posted successfully"
    });
  };

  const addResponse = (queryId: string, teacherId: string, resourceUrl: string, resourceType: "pdf" | "image") => {
    const newResponse: Response = {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      queryId,
      teacherId,
      resourceUrl,
      resourceType,
      createdAt: new Date().toISOString()
    };

    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          responses: [...query.responses, newResponse]
        };
      }
      return query;
    }));

    toast({
      title: "Response Added",
      description: "Your response has been added successfully"
    });
  };

  const addComment = (queryId: string, authorId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Math.random().toString(36).substr(2, 9)}`,
      queryId,
      authorId,
      content,
      createdAt: new Date().toISOString()
    };

    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          comments: [...query.comments, newComment]
        };
      }
      return query;
    }));

    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully"
    });
  };

  const upvoteQuery = (queryId: string) => {
    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          upvotes: query.upvotes + 1
        };
      }
      return query;
    }));
  };

  const downvoteQuery = (queryId: string) => {
    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          downvotes: query.downvotes + 1
        };
      }
      return query;
    }));
  };

  return (
    <QueryContext.Provider value={{
      queries,
      getQueryById,
      createQuery,
      addResponse,
      addComment,
      upvoteQuery,
      downvoteQuery
    }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueries = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error("useQueries must be used within a QueryProvider");
  }
  return context;
};
