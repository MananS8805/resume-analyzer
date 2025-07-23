import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "~/constants";
import { callbackify } from "util"; 
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resuaid" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  
  const {auth}=usePuterStore()
    const location=useLocation()
    const navigate=useNavigate()

    useEffect(()=>{
        if (!auth.isAuthenticated) {
            navigate('/auth?next=/')
        }
    },[auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py:16">
          <h1>Track your application and   Resume Rating.</h1>
          <h2>Review your submission and get feedback from our AI</h2>
        </div>
      
      {resumes.length > 0 && (<div className="resumes-section">
    {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
      </div>)}
      </section>


      
      
    </main>
  ); 
}
