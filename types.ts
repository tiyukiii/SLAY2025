
export interface Candidate {
  id: string;
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  description: string;
  candidates: Candidate[];
}

export interface Vote {
  id: string;
  categoryId: string;
  candidateId: string;
  voterEmail: string;
  timestamp: number;
}

export interface User {
  email: string;
  isLoggedIn: boolean;
}
