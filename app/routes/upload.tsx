import React, { type FormEvent } from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants/index"; // Ensure this import is correct
// Update the import path to the correct location of prepareInstructions

const upload = () => {
    const {auth,isLoading,fs,ai,kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file,setFile] = useState<File | null>(null);

    const handleAnalyze= async ({companyName,jobTitle,jobDescription,file}:{companyName:string,jobTitle:string,jobDescription:string,file:File})=>{
        setIsProcessing(true);
        setStatusText("Uploading your resume...");
        const uploadedfile=await fs.upload([file]); // uploading file to puter 

        if(!uploadedfile){
            return setStatusText("Failed to upload file");
        
            
        }

        setStatusText("Converting to image...");
        const image=await convertPdfToImage(file); // converting pdf to image
        if(!image.file){
            return setStatusText("Failed to convert pdf to image");
        }

        setStatusText("uploading image...");
        const uploadedImage = await fs.upload([image.file]); // uploading image to puter
        if(!uploadedImage){
            return setStatusText("Failed to upload image");
        }

        setStatusText("Preparign your resume for analysis...");

        const uuid=generateUUID();
        
        const data={
            id: uuid,
            resumePath: uploadedfile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',

    }
    await kv.set(`resume:${uuid}`,JSON.stringify(data)); // saving resume data to kv store
    setStatusText("Analyzing your resume...");
    const feedback=await ai.feedback(
        uploadedfile.path,
        prepareInstructions({
            jobTitle,
            jobDescription,
            AIResponseFormat: "json" // or use the correct format string required by your app
        })
    ); // getting feedback from AI
     

    if(!feedback){
        return setStatusText("Failed to get feedback from AI");
    }
    const feedbacktext=typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0].text;
    data.feedback=JSON.parse(feedbacktext); // parsing feedback text
    await kv.set(`resume:${uuid}`,JSON.stringify(data)); // saving feedback to kv store
    setStatusText("Done! Redirecting you to your resume...");
    console.log(data);
    console.log(uuid)
    navigate(`/resume/${uuid}`); // redirecting to resume page    
    }   

    const handlesubmit = (e : FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;
        handleAnalyze({companyName,jobTitle,jobDescription,file: file as File});   
    }



    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    return(
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py-16">
            <h1>Smart feedback for your resume</h1>
            {isProcessing ? (
                <>
                    <h2>{statusText}</h2>
                    <img src="./images/resume-scan.gif" alt="" className="w-full" />
                </>):(
                    <h2>Drop your resume for an ATS score and improvement tips</h2>
                )
            }
            {!isProcessing && (
                <form action="" id="upload-form" onSubmit={handlesubmit} className="flex flex-col gap-4">
                    <div className="form-div mt-8">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="company-name" id="company-name" placeholder="Company Name" required />
                    </div>

                    <div className="form-div mt-8">
                        <label htmlFor="job title">job-title</label>
                        <input type="text" name="job-title" id="job-title" placeholder="job title" required />
                    </div>

                    <div className="form-div mt-8">
                        <label htmlFor="job description">Job description</label>
                        <textarea rows={5} name="job-description" id="job-description" placeholder="job-description" required />
                    </div>

                    <div className="form-div mt-8">
                        <label htmlFor="uploader">uploader</label>
                        <FileUploader onFileSelect={handleFileSelect}/>
                    </div>
                    <button className="primary-button" type="submit">
                        Analyze Resume
                    </button>
                </form>
            )}
        </div>
      </section>


      
      
    </main>
    )
}
export default upload;