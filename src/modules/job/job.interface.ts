export interface ICreateJob {
  title: string;
  description: string;
  requirements?: string;
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline?: string;
  categoryId: string;
}

export interface IUpdateJob {
  title?: string;
  description?: string;
  requirements?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline?: string;
  categoryId?: string;
  isActive?: boolean;
}