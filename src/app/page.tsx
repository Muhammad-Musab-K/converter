"use client";

import { useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import axios from 'axios';
import { Progress } from "@/components/ui/progress";
import { BiSolidFileJson } from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const {toast} = useToast()



  const convertPDFintoJSON = async (file: File) => {
    if (!file) {
      toast({
        description: "Please upload file in pdf format",
        variant: "destructive"
      })
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post("https://resume-parser-gules.vercel.app/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      toast({
        description: "Something went wrong!",
        variant: "destructive"
      })
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>): void => {
    let file: File | undefined;
    if ("dataTransfer" in e) {
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      convertPDFintoJSON(file);
    } else {
      toast({
        description: "Please upload file in pdf format",
        variant: "destructive"
      })
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handleFileUpload(e);
  };

  return (
    <main className="w-screen h-screen text-slate-600 flex min-h-screen justify-center flex-col items-center p-5 lg:p-24">
      <h1 className="font-extrabold text-4xl mb-10 text-center">Convert PDF into JSON online for free</h1>
      <div className="w-full md:w-4/5 shadow-lg rounded-md p-4">
        <div
          className="flex gap-4 md:gap-6 flex-col justify-center items-center m-auto border-2 rounded-sm border-dashed p-6 border-slate-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!loading && (
            <>
              <FaFilePdf className="text-6xl text-orange-600" />

              <h4 className="text-xl text-center">Drag and drop your document here to upload</h4>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.rtf,.ppt,.pptx,.jpeg,.png,.txt"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="bg-orange-400 text-white py-2 px-4 rounded-lg shadow hover:bg-orange-500 cursor-pointer">
                Select from device
              </label>
              <div>
                {/* {pdfFile && (
                  <div className="flex flex-col items-center border-2 rounded-sm p-2">
                    <FaFilePdf className="text-3xl text-red-500" />
                    <p className="text-xs">{pdfFile.name}</p>
                  </div>
                )} */}
              </div>
              <p className="text-slate-300 text-sm">
                Up to 100 MB for PDF and up to 25 MB for DOC, DOCX, RTF, PPT, PPTX, JPEG, PNG, or TXT
              </p>
            </>
          )}
          {loading && (
            <div className="w-80 flex flex-col gap-3 items-center">
              <BiSolidFileJson className="text-6xl text-yellow-600" />
              <span className="w-80 flex gap-1">
                <Progress value={progress} max={100} />
                <p className="text-center mt-2 text-xs">{progress}%</p>
              </span>
            </div>
          )}
        </div>
      </div>
      {!loading && (
        <div>
          <p className="text-slate-300 text-sm text-center mt-8">
            Note: Integration described on this webpage may temporarily not be available.
          </p>
          <p className="text-slate-500 text-sm text-center mt-4">
            Today Sep 3rd, 2024*
          </p>
        </div>
      )}
    </main>
  );
}

