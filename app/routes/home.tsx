import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";


import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

import { useNavigate } from "react-router";
import { use, useEffect, useState } from "react";
import Resume from "./resume";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resuaid" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  
  const {auth,kv}=usePuterStore()
    
    const navigate=useNavigate()
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);


   

    useEffect(()=>{
        if (!auth.isAuthenticated) {
            navigate('/auth?next=/')
        }
    },[auth.isAuthenticated])


    useEffect(() => {
      const loadResumes = async () => {
        setLoading(true);

        const resumes=(await kv.list("resume:*",true)) as KVItem[];

        const parsedResumes = resumes?.map((resume) => {
          return JSON.parse(resume.value) as Resume;
        });
        console.log({ parsedResumes });
        setResumes(parsedResumes || []);
        setLoading(false);

      }
      loadResumes();
    },[])


    
  return (

  
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py:16">
          <h1>Track your application and   Resume Rating.</h1>
          {!loading && resumes.length > 0 ? ( <h2>No Resumes yet upload your first resumes to get feedback</h2>):(<h2>Review your submission and get feedback from our AI</h2>)}
          
        </div>
        {loading && (
          <div className="flex items-center justify-center flex-col">
            <img src="/images/resume-scan-2.gif"className="w-200 " alt="" />
          </div>
        )}
      
      {!loading && resumes.length > 0 && (<div className="resumes-section">
    {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
      </div>)}

      {!loading && resumes.length === 0 && (
        <div className="flex items-center justify-center flex-col mt-10 gap-4">
         <Link to="/upload" className="primary-button font-semibold w-fit text-xl ">Upload Resume</Link>
         </div>)
      }
      </section>


      
      
    </main>
  ); 
}
