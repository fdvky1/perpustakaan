import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Role } from "@prisma/client";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: Role;
  }
}

declare module "next-auth" {
  interface User extends User {
    role: Role;
  }
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}