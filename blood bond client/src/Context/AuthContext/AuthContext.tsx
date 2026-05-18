// src/context/AuthContext.tsx

import { createContext } from "react";
import type { User, UserCredential } from "firebase/auth";

// and fixing the logOutUser type which should be a function that returns Promise<void> or Promise<void | string>.

export type UserInfoType = {
  user: User | undefined;
  loading: boolean;

  registerUser: (email: string, password: string) => Promise<UserCredential>;

  loginUser: (email: string, password: string) => Promise<UserCredential>;

  signinWithGoogle: () => Promise<UserCredential>;

  logOutUser: () => Promise<void>;

  profileUpdate: (userInformation: {
    displayName?: string;
    photoURL?: string;
    accessToken?: string;
  }) => Promise<void>;
};

// Context value is either UserInfoType or undefined initially (used with a check in useAuth)
const AuthContext = createContext<UserInfoType | undefined>(undefined);

export default AuthContext;
