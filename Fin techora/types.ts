
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface FixedDeposit {
  id: string;
  userId: string;
  bankName: string;
  principal: number;
  interestRate: number; // annual %
  durationMonths: number;
  startDate: string;
  maturityDate: string;
  status: 'ACTIVE' | 'MATURED';
}

export interface FinancialCalculation {
  maturityValue: number;
  totalInterest: number;
  growthData: { month: number; value: number }[];
}

export interface ComparisonData {
  type: 'FD' | 'Savings' | 'RD';
  label: string;
  maturityValue: number;
  interestRate: number;
}
