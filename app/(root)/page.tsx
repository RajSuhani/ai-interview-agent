import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";

const Page = () => {
  return (
      <>
          <section className="w-full flex flex-col-reverse lg:flex-row justify-between items-center gap-8 p-6 md:p-12 rounded-2xl shadow-xl backdrop-blur-md bg-indigo-500/10 border-white/10">
              {/* Text Left Side */}
              <div className="flex flex-col gap-6 max-w-xl text-white">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                      Ace Your Next Interview with <span className="text-blue-400">AI Power</span>
                  </h1>
                  <p className="text-lg text-slate-200">
                      Practice real-world interview questions with a smart AI agent designed to sharpen your skills.
                  </p>

                  <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                      Start Interview
                  </Button>
              </div>

              {/* Robot Image Right Side */}
              <div className="max-w-sm w-full flex justify-center">
                  <Image
                      src="/robot.png" // You can change this to any better AI-themed image
                      alt="AI Interview Assistant"
                      width={360}
                      height={360}
                      className="object-contain drop-shadow-2xl rounded-xl"
                  />
              </div>
          </section>


          <section className={"flex flex-col gap-6 mt-8"}>
          <h2>Your Interview</h2>
          <div className={"interview-section"}>
              {dummyInterviews.map((interview) => (
                  <InterviewCard key={interview.id} {...interview} />
              ))}

          </div>
        </section>

        <section className={"flex flex-col gap-6 mt-8"}>
          <h2>Take an Interview</h2>
          <div className={"Interviews-section"}>
              {dummyInterviews.map((interview) => (
                  <InterviewCard key={interview.id} {...interview} />
              ))}

              {/*<p>You have not taken any interview yet.</p>*/}
          </div>
        </section>
      </>
  )
}

export default Page