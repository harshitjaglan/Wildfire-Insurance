interface Room {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}

export type { User };
