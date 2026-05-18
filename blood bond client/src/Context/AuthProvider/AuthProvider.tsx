import { useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "@/Firebase/Firebase.init";
import AuthContext from "../AuthContext/AuthContext";
import type { UserInfoType } from "../AuthContext/AuthContext";

// ------------------
//! Props Type
// ------------------
type AuthProviderProps = {
  children: ReactNode;
};

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // ------------------
  // Register User
  // ------------------
  const registerUser: UserInfoType["registerUser"] = async (
    email,
    password
  ) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return result;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  };

  // ------------------
  //! Login User
  // ------------------
  const loginUser: UserInfoType["loginUser"] = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // ------------------
  //! Google Sign In
  // ------------------
  const signinWithGoogle: UserInfoType["signinWithGoogle"] = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Google Signin Error:", error);
      throw error;
    }
  };

  // ------------------
  //! Logout
  // ------------------
  const logOutUser: UserInfoType["logOutUser"] = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  // ------------------
  //! Update Profile
  // ------------------
  const profileUpdate: UserInfoType["profileUpdate"] = async (
    userInformation
  ) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }
      await updateProfile(auth.currentUser, userInformation);
    } catch (error) {
      console.error("Profile Update Error:", error);
      throw error;
    }
  };

  // ------------------
  //! Auth State Observer
  useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  if (currentUser) {
    await currentUser.reload();
    setUser(auth.currentUser ?? currentUser);

        const token = await currentUser.getIdToken();
        localStorage.setItem("access-token", token);
      } else {
        setUser(undefined);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ------------------
  //! Context Value
  // ------------------
  const userInfo: UserInfoType = {
    user,
    loading,
    registerUser,
    loginUser,
    signinWithGoogle,
    logOutUser,
    profileUpdate,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
