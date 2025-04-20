
import { Response } from "@/types";
import { users } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { FileText, FileImage, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";

interface ResponseCardProps {
  response: Response;
}

const ResponseCard = ({ response }: ResponseCardProps) => {
  const teacher = users.find(user => user.id === response.teacherId);
  
  return (
    <Card className="p-4 mb-4 bg-secondary/40">
      <div className="flex items-start">
        <Avatar className="mr-4">
          <AvatarImage src={teacher?.avatar} alt={teacher?.name} />
          <AvatarFallback>{teacher?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{teacher?.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center">
              {response.resourceType === "pdf" ? (
                <FileText className="h-5 w-5 mr-2" />
              ) : (
                <FileImage className="h-5 w-5 mr-2" />
              )}
              <span className="flex-1">
                {response.resourceType === "pdf" ? "PDF Document" : "Image"} Response
              </span>
              <Button size="sm" asChild>
                <a href={response.resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResponseCard;
