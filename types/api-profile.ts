export type GetProfileOutput = {
  id: number;
  method: string;
  email: string;
  name: string;
  avatar: string;
  joined_at: Date;
};

export type UpdateProfileOutput = {
  name: string;
  avatar: string;
  updated_at: Date;
};
