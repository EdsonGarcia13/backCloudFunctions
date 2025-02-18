export interface Task {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    createdat: Date;
    userid: string;
  }
  
  export interface User {
    id?: string;
    email: string;
    createdat: Date;
  }