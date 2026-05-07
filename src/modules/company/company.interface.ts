export interface ICreateCompany {
  companyName: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
  description?: string;
}

export interface IUpdateCompany {
  companyName?: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
  description?: string;
}