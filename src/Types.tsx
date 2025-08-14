// types.ts - Shared type definitions

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    identityNumber: number;
    birthDate: Date;
    status: boolean;
  }