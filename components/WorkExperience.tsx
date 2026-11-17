import React from "react";
import { SparklesText } from "./ui/SparklesText";
import { workExperience } from "@/data";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";

const Experience = () => {
  return (
    <div className="py-20 w-full ">
      <h1 className="heading flex items-center justify-center flex-wrap gap-x-4">
        My{" "}
        <SparklesText className="accent-text">
          {" "}
          work experience
        </SparklesText>
      </h1>

      <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            //   random duration will be fun , I think , may be not
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              //   add these two
              //   you can generate the color from here https://cssgradient.io/
              background: "var(--color-panel)",
              boxShadow: `0 0 20px rgba(0,0,0,0.1)`,
              borderRadius: `calc(1.75rem* 0.96)`,
            }}
            className="flex-1 text-fg border-line"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
              <Image
                width={1000}
                height={1000}
                src={card.thumbnail}
                alt={card.thumbnail}
                className="lg:w-32 md:w-20 w-16"
              />
              <div className="lg:ms-5">
                <h1 className="font-display text-start text-2xl md:text-3xl font-normal tracking-tight">
                  {card.title}
                </h1>
                <p className="text-start text-mute mt-3 font-medium">
                  {card.desc}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
