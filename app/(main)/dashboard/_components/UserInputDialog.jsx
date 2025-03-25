import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { ExpertDetails } from "../../../services/Options";
function UserInputDialog({ children, expert }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [topic, setTopic] = useState();
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expert.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="text-black">
                Enter a topic to skills in {expert.name}
              </h2>
              <Textarea
                className="resize-none mt-2"
                placeholder="Enter your topic here..."
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <h2 className="mt-5 text-black">
                Enter a topic to skills in {expert.name}
              </h2>
              <div className="grid grid-cols-4 mt-3 gap-2">
                {ExpertDetails.map((expert) => (
                  <div
                    key={expert.name}
                    onClick={() => setSelectedExpert(expert.name)}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={`w-[100px] h-[100px] rounded-full object-cover hover:scale-105 transition-all 
                      duration-300 cursor-pointer  p-1 border-primary ${
                        selectedExpert === expert.name && "border-2"
                      }`}
                    />
                    <h2>{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-5 mt-5">
                <Button variant="outline">Cancel</Button>
                <Button disabled={!topic || !selectedExpert}>Next</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;
