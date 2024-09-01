"use client";

import Image from "next/image";
import profile from "../../../public/profile.png";
import { IoLogoHtml5, IoLogoNodejs, IoLogoPython } from "react-icons/io5";
import { IoLogoCss3, IoLogoJavascript } from "react-icons/io";
import { BiLogoPostgresql, BiLogoTypescript } from "react-icons/bi";
import { FaReact, FaGitAlt, FaPaintbrush } from "react-icons/fa6";

import {
  SiExpress,
  SiFramer,
  SiMongodb,
  SiPrisma,
  SiTailwindcss,
  SiNextdotjs,
  SiMysql
} from "react-icons/si";
import { motion } from "framer-motion";
import GlobeComponent from "@/components/ui/Globe";

const skills = [
  {
    name: "HTML",
    icon: <IoLogoHtml5 className="text-4xl" />,
  },
  {
    name: "CSS",
    icon: <IoLogoCss3 className="text-4xl" />,
  },
  {
    name: "Javascript",
    icon: <IoLogoJavascript className="text-4xl" />,
  },
  {
    name: "Typescript",
    icon: <BiLogoTypescript className="text-4xl" />,
  },
  {
    name: "ReactJS",
    icon: <FaReact className="text-4xl" />,
  },
  {
    name: "NextJS",
    icon: <SiNextdotjs className="text-4xl" />,
  },
  {
    name: "NodeJS",
    icon: <IoLogoNodejs className="text-4xl" />,
  },
  {
    name: "ExpressJS",
    icon: <SiExpress className="text-4xl" />,
  },
  {
    name: "Git",
    icon: <FaGitAlt className="text-4xl" />,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-4xl" />,
  },
  {
    name: "Prisma",
    icon: <SiPrisma className="text-4xl" />,
  },
  {
    name: "MongoDB",
    icon: <SiMongodb className="text-4xl" />,
  },
  {
    name: "PostgreSQL",
    icon: <BiLogoPostgresql className="text-4xl" />,
  },
  {
    name: "MySQL",
    icon: <SiMysql className="text-4xl" />,
  },
  {
    name: "Framer Motion",
    icon: <SiFramer className="text-4xl" />,
  },
];

export default function page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      className="mt-10 lg:container w-full p-2"
    >
      <h1 className="font-bold text-3xl mb-2 ml-3">Who am I</h1>
      <div className=" border-t p-3 flex md:flex-row flex-col gap-10 items-center">
        <div>
          <p className="mt-5">
          I’m a full-stack developer with a passion for building web applications. My work involves designing and optimizing both front-end and back-end components, focusing on creating seamless user experiences. I have a strong background in developing CRM systems, creating RESTful APIs, and integrating third-party services. I utilize technologies such as React,.js, Next.js, JavScript, TypeScript, MySQL, MongoDB, Node.js, and AWS to build scalable and secure solutions.


          </p>
          <p className="mt-5 mb-10">
          In addition to my development work, I enjoy writing tech blogs and continuously learning new technologies. Currently, I am diving into cloud computing and DevOps, expanding my skill set to include more aspects of modern software development. This continuous learning fuels my passion for innovation and helps me stay at the forefront of technology.
          </p>

          <h1 className="font-bold text-3xl mb-2">My Tech stack</h1>
          <div className="border-t ">
            <div className="flex md:gap-4 flex-wrap p-2 mt-5">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 p-2 md:p-1"
                >
                  {skill.icon}
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <GlobeComponent />
      </div>

      <h1 className="font-bold text-3xl mb-2 mt-8 ml-2 ">About this website</h1>
      <div className="border-t p-3">
        <h1 className="p-2">Next js</h1>
        <h1 className="p-2">Typescript</h1>
        <h1 className="p-2">Deployed on vercel</h1>
        <h1 className="p-2">Shadcn</h1>
        <h1 className="p-2">Aceternity UI</h1>
        <h1 className="p-2">Tailwind Css</h1>
      </div>
    </motion.div>
  );
}
