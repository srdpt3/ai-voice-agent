"use client";
import React from "react";
import { useUser } from "@stackframe/stack";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExpertsLists } from "../../../services/Options";
import { BlurFade } from "@/components/ui/blur-fade";
import UserInputDialog from "./UserInputDialog";
const FeatureAssistant = () => {
  const user = useUser();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-500 font-bold">My WorkSpace</h2>
          <h2 className="text-2xl font-bold">
            Welcome back, {user?.displayName}
          </h2>
        </div>
        <Button>
          <User />
          <span className="text-sm font-medium">Profile</span>
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-10">
        {ExpertsLists.map((expert, idx) => (
          <BlurFade key={expert.image} delay={0.25 + idx * 0.05} inView>
            <div
              key={expert.name}
              className="p-3 bg-secondary rounded-3xl flex flex-col items-center justify-center"
            >
              <UserInputDialog expert={expert}>
                <div key={expert.name} className="flex flex-col">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    width={150}
                    height={150}
                    className="h-[70px] w-[70px] hover:rotate-12 transition-all duration-300 mx-auto"
                  />
                  <h2 className="mt-2 font-medium">{expert.name}</h2>
                </div>
              </UserInputDialog>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default FeatureAssistant;
