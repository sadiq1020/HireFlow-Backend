export interface IApproveCompany {
  status: 'APPROVED' | 'REJECTED';
  rejectionNote?: string;
}