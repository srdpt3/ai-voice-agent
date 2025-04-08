"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ExpertDetails } from "app/services/Options";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import ChatBox from "./_components/ChatBox";
// import RecordRTC from "recordrtc";
import { useRef } from "react";
import dynamic from "next/dynamic";
import * as AssemblyAI from "assemblyai";
import { getToken, AIModel } from "app/services/GlobalServices";
import { Loader2 } from "lucide-react";
function DiscussionRoomPage() {
  const { roomid } = useParams();
  const [expert, setExpert] = useState(null);
  const [enableMicrophone, setEnableMicrophone] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello, how can I help you today?",
    },
    {
      role: "user",
      content: "Hi",
    },
  ]);
  const [loading, setLoading] = useState(false);

  let text = {};

  const discussionRoom = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
  const recorderCurrent = useRef(null);
  const realTimeTrascriber = useRef(null);
  let silenceTimeout = null;
  useEffect(() => {
    if (discussionRoom) {
      const Expert = ExpertDetails.find(
        (expert) => expert.name === discussionRoom?.expert,
      );
      setExpert(Expert);
    }
  }, [discussionRoom]);

  useEffect(() => {
    async function fetchData() {
      if (conversation[conversation.length - 1].role === "user") {
        // Calling AI text Model to Get Response
        const lastTwoMsg = conversation.slice(-2);
        const aiResp = await AIModel(
          discussionRoom?.topic,
          discussionRoom?.coachingOption,
          lastTwoMsg,
        );

        console.log(aiResp);
        setConversation((prev) => [...prev, aiResp]);
      }
    }

    fetchData();
  }, [conversation]);

  const connectToServer = async () => {
    setEnableMicrophone(true);
    //Init AssemblyAI
    setLoading(true);
    const token = await getToken();
    realTimeTrascriber.current = new AssemblyAI.RealtimeTranscriber({
      token: token,
      sample_rate: 44100,
    });

    realTimeTrascriber.current.on("transcript", async (transcript) => {
      console.log(transcript);
      let msg = "";
      if (transcript.message_type === "FinalTranscript") {
        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: transcript?.text,
          },
        ]);
        // AI response will be handled by the useEffect
      }
      text[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(text);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (text[key]) {
          msg += `${text[key]} `;
        }
      }
      setTranscript(msg);
    });

    await realTimeTrascriber.current.connect();
    setLoading(false);
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
              desiredSampRate: 44100,
              numberOfAudioChannels: 1,
              bufferSize: 4096,
              audioBitsPerSecond: 128000,
              ondataavailable: async (blob) => {
                // Reset the silence detection timer on audio input
                if (!recorderCurrent.current) return;
                clearTimeout(silenceTimeout);

                const buffer = await blob.arrayBuffer();
                // console.log(buffer);
                realTimeTrascriber.current.sendAudio(buffer);
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

  const disconnectFromServer = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (realTimeTrascriber.current) {
      // Check if close method exists (newer versions of the API might use close instead of disconnect)
      if (typeof realTimeTrascriber.current.close === "function") {
        await realTimeTrascriber.current.close();
      } else if (typeof realTimeTrascriber.current.stop === "function") {
        await realTimeTrascriber.current.stop();
      }
      realTimeTrascriber.current = null;
    }

    if (recorderCurrent.current) {
      recorderCurrent.current.pauseRecording();
      recorderCurrent.current.stopRecording();
      recorderCurrent.current = null;
    }

    setEnableMicrophone(false);
    setLoading(false);
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{discussionRoom?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-10">
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
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!loading && "Connect"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={disconnectFromServer}
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!loading && "Disconnect"}
              </Button>
            )}
          </div>
        </div>
        <div>
          <ChatBox conversation={conversation} />
        </div>
      </div>
      {/* <div className="mt-5">
        <h2 className="text-gray-500 ">Transcript</h2>
        <div className="mt-2 text-sm">{transcript}</div>
      </div> */}
    </div>
  );
}

export default DiscussionRoomPage;
