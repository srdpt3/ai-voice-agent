"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ExpertDetails } from "app/services/Options";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
function DiscussionRoomPage() {
  const { roomid } = useParams();
  const [expert, setExpert] = useState(null);
  const discussionRoom = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  console.log(discussionRoom);
  useEffect(() => {
    if (discussionRoom) {
      const Expert = ExpertDetails.find(
        (expert) => expert.name === discussionRoom?.expert,
      );
      setExpert(Expert);
    }
  }, [discussionRoom]);

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{discussionRoom?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 ">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col justify-center items-center relative">
            {expert?.avatar ? (
              <Image
                src={expert.avatar || null}
                alt={expert?.name || "Avatar"}
                width={200}
                height={200}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            ) : (
              <div className="h-[80px] w-[80px] rounded-full bg-gray-300 animate-pulse"></div>
            )}
            <h2 className="text-gray-500 ">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex justify-cente  r items-center">
            <Button>Connect</Button>
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col justify-center items-center relative">
            <h2 className="text-gray-500 ">Chat Section</h2>
          </div>
          <h2 className="text-gray-500 mt-4 text-sm ">
            At the end of conversation we will automatically generate a summary
            of the conversation and send it to you.
          </h2>
        </div>
      </div>
    </div>
  );
}
export default DiscussionRoomPage;
