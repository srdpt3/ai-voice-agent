import React from "react";

const ChatBox = ({ conversation }) => {
  return (
    <div>
      <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col  relative p-4 overflow-auto">
        <div className="w-full h-full overflow-y-auto">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }  `}
            >
              {message.role === "assistant" ? (
                <div className="p-1 px-2 bg-primary  mt-1 rounded-md text-white inline-block">
                  {message.content}
                </div>
              ) : (
                <div
                  className="p-1 px-2 bg-gray-200  mt-1 rounded-md text-black 
                flex justify-end inline-block"
                >
                  {message.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-gray-500 mt-4 text-sm ">
        At the end of conversation we will automatically generate a summary of
        the conversation and send it to you.
      </h2>
    </div>
  );
};

export default ChatBox;
