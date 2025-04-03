"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ExpertDetails } from "app/services/Options";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
// import RecordRTC from "recordrtc";
import { useRef } from "react";
import dynamic from "next/dynamic";
function DiscussionRoomPage() {
  const { roomid } = useParams();
  const [expert, setExpert] = useState(null);
  const [enableMicrophone, setEnableMicrophone] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const discussionRoom = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
  const recorderCurrent = useRef(null);
  let silenceTimeout = null;
  console.log(discussionRoom);
  useEffect(() => {
    if (discussionRoom) {
      const Expert = ExpertDetails.find(
        (expert) => expert.name === discussionRoom?.expert,
      );
      setExpert(Expert);
    }
  }, [discussionRoom]);

  const connectToServer = () => {
    setEnableMicrophone(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Import RecordRTC dynamically
          import("recordrtc").then((RecordRTCModule) => {
            const RecordRTC = RecordRTCModule.default;

            // Create a new RecordRTC instance
            recorderCurrent.current = new RecordRTC(stream, {
              type: "audio",
              mimeType: "audio/webm;codecs=pcm",
              recorderType: RecordRTC.StereoAudioRecorder,
              timeSlice: 250,
              desiredSampRate: 16000,
              numberOfAudioChannels: 1,
              bufferSize: 4096,
              audioBitsPerSecond: 128000,
              ondataavailable: async (blob) => {
                // Reset the silence detection timer on audio input
                clearTimeout(silenceTimeout);

                const buffer = await blob.arrayBuffer();
                console.log(buffer);

                // Restart the silence detection timer
                silenceTimeout = setTimeout(() => {
                  console.log("User stopped talking");
                  // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
                }, 2000);
              },
            });

            // Start recording
            recorderCurrent.current.startRecording();
            console.log("Microphone access granted");
          });
        })
        .catch((err) => console.error(err));
    }
  };

  const disconnectFromServer = (e) => {
    e.preventDefault();
    recorderCurrent.current.pauseRecording();
    recorderCurrent.current = null;
    setEnableMicrophone(false);
  };

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
          <div className="mt-5 flex justify-center items-center">
            {!enableMicrophone ? (
              <Button
                onClick={connectToServer}
                className={
                  enableMicrophone ? "bg-green-500 hover:bg-green-600" : ""
                }
              >
                {enableMicrophone ? "Connected" : "Connect"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={disconnectFromServer}>
                Disconnect
              </Button>
            )}
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
