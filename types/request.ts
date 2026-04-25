export type RequestStatus = "new" | "in_review" | "completed" | "rejected";

export interface Request {
  id: string;
  projectId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  message: string | null;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
