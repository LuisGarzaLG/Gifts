export interface Employee {
  id: number;
  employeeNumber: number;
  name: string;
  area: string;
  supervisor: string;
  shift: string;
  jobDescription: string;
}

export interface Concept{
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  lastDate: Date | null;

}

export interface Report{
  id: number,
  employeeNumber: string,
  employeeName: string,
  name: string,
  description: string,
  shift: string,
  lastDate: Date | null,
  lastUser: string,
  
}

