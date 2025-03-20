"use client";
import { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";
const AuthProvider = ({ children }) => {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await createUser({
      name: user?.displayName,
      email: user?.primaryEmail,
    });
    console.log(result);
    return result;
  };

  return <>{children}</>;
};

export default AuthProvider;
