
export type UserRole = 'student' | 'teacher';

export type Community = {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
};

export type Subject = {
  id: string;
  name: string;
  communityId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  communities: string[]; // community IDs
  responseCount?: number; // for teachers
};

export type Query = {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  authorId: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  responses: Response[];
  comments: Comment[];
};

export type Response = {
  id: string;
  queryId: string;
  teacherId: string;
  resourceUrl: string; // URL to PDF or image
  resourceType: 'pdf' | 'image';
  createdAt: string;
};

export type Comment = {
  id: string;
  queryId: string;
  authorId: string;
  content: string;
  createdAt: string;
};
