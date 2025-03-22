import React from "react";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
const AppHeader = () => {
  return (
    <div className="flex justify-between items-center p-3 shadow-sm">
      <Image src={"/logo.svg"} alt="logo" width={160} height={100} />
      <UserButton />
    </div>
  );
};

export default AppHeader;
