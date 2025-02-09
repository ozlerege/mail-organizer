export interface Mail {
  id: string;
  name: string;
  subject: string;
  text: string;
  date: Date;
  read: boolean;
  labels: string[];
  email?: string;
}
