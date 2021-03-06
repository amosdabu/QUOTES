export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
  friendReq?: string[];
  friendsList?:string[];
}
