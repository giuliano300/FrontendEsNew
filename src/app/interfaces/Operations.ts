export interface Operations {
    id: number;
    insertDate: string;
    userId: number;
    userParentId: number;
    name: string;
    complete: boolean;
    areaTestOperation: boolean;
    error: boolean;
    errorMessage?: string;
    csvFileName?: string;
  }
  