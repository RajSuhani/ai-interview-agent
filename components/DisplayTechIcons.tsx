"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTechLogos } from "@/lib/utils"; // ✅ Ensure this function exists and works

type TechIcon = {
    tech: string;
    url: string;
};

type TechIconProps = {
    techStack: string[];
};

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
    const [icons, setIcons] = useState<TechIcon[]>([]);

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const data = await getTechLogos(techStack);
                setIcons(data.slice(0, 3)); // Show only first 3 tech logos
            } catch (error) {
                console.error("Error fetching tech logos:", error);
            }
        };

        fetchIcons();
    }, [techStack]);

    return (
        <div className="flex flex-row gap-2">
            {icons.map(({ tech, url }) => (
                <div
                    key={tech}
                    className="relative group bg-white rounded-full w-10 h-10 p-2 flex items-center justify-center"
                >
          <span className="tech-tooltip absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            {tech}
          </span>
                    <Image
                        src={url}
                        alt={tech}
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </div>
            ))}
        </div>
    );
};

export default DisplayTechIcons;
