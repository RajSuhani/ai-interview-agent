import React from 'react';
import Image from 'next/image';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface AgentProps {
    userName: string;
}

const Agent = ({ userName }: AgentProps) => {
    const callStatus = CallStatus.FINISHED;
    const isSpeaking = true;
    const messages = [
        'Whats your name?',
        'My name is Suhani, nice to meet you!',
    ];
    const lastMessage = messages[messages.length - 1];

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-white font-sans">
            <h2 className="text-4xl font-semibold mb-10 text-center">AI Interview Builder</h2>

            {/* Cards */}
            <div className="flex flex-col md:flex-row gap-10 items-center justify-center mb-4">
                {/* AI Card */}
                <div className="w-110 h-110 rounded-2xl border border-purple-900 bg-[#111827] flex flex-col items-center justify-center p-4">
                    <div className="relative bg-gradient-to-br from-blue-300 to-blue-800 p-9 rounded-full mb-4">
                        <Image
                            src="/ai-avatar.png"
                            alt="vapi"
                            width={70}
                            height={70}
                            className="object-contain"
                        />
                        {isSpeaking && (
                            <span className="animate-speak absolute top-3 right-3 w-4 h-4 bg-green-400 rounded-full"></span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-center">AI Just Interviewed You</h3>
                </div>

                {/* User Card */}
                <div className="w-110 h-110 rounded-2xl border border-purple-900 bg-[#111827] flex flex-col items-center justify-center p-4">
                    <div className="w-37 h-37 rounded-full overflow-hidden mb-4 border-4 border-white">
                        <Image
                            src="/user-avatar.png"
                            alt="User Avatar"
                            width={145}
                            height={145}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="text-lg font-semibold">{userName || 'You'}</h3>
                </div>
            </div>

            {/* Message Bubble */}
            {lastMessage && (
                <div className="flex flex-col items-center justify-center gap-5 bg-[#111827] border border-purple-900 px-12 py-4 rounded-xl text-lg text-center mb-6 w-[90%] max-w-3xl">
                    {lastMessage}
                </div>
            )}

            {/* Call Button */}
            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button className="relative bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg">
                        <span className="absolute -inset-1 rounded-full bg-green-400 opacity-75 animate-pulse z-0" />
                        <span className="relative z-10">
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                                ? 'Start New Interview'
                                : '...'}
                        </span>
                    </button>
                ) : (
                    <button className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-8 rounded-full transition duration-300">
                        END
                    </button>
                )}
            </div>
        </div>
    );
};

export default Agent;
