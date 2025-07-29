import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";

type InterviewCardProps = {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    level: string;
    questions: string[];
    finalized: boolean;
    createdAt: string;
    feedback?: {
        totalscore: number;
        finalAssessment?: string;
    };
};

const normalizeType = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

const InterviewCard = ({
                           id,
                           role,
                           type,
                           techstack,
                           createdAt,
                           feedback,
                       }: InterviewCardProps) => {
    const formattedDate = dayjs(createdAt).format("MMM DD, YYYY");
    const normalizedType = normalizeType(type);

    return (
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-indigo-500/10 via-purple-500/40 to-indigo-500/10 hover:shadow-blue-500/50 transition-all group">
            <div className="bg-white dark:bg-[#111827] rounded-[inherit] p-6 w-full text-black dark:text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Cover Avatar */}
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border border-white/20 dark:border-white/10"
                    />

                    {/* Info Section */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{role} Interview</h3>

                        <div className="flex gap-5 text-sm text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                                <Image src="/calendar.svg" alt="calendar" width={20} height={20} />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/star.svg" alt="rating" width={20} height={20} />
                                <span>{feedback?.totalscore ?? "---"}/100</span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">
                            {feedback?.finalAssessment ??
                                "You have not taken the interview yet. Take it now to improve your skills."}
                        </p>
                    </div>

                    {/* Tech stack and CTA */}
                    <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
                        <DisplayTechIcons techStack={techstack} />

                        <Link
                            href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
                            className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                            {feedback ? "Check Feedback" : "View Interview"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
