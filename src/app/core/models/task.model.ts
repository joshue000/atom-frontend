export interface PaginationMetadata {
  page: number;
  numberOfPages: number;
  limit: number;
  offset: number;
  total: number;
}

export interface PaginatedResponse<T> {
  metadata: PaginationMetadata;
  data: T[];
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}
