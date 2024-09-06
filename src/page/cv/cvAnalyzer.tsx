import Navbar from "@/components/common/navbar";
import { analyzeCV } from "@/services/api";
import { CvResult } from "@/types/cv-result";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const dummyResult = {
  summary:
    "Dalam analisis ini, kami menemukan bahwa kamu sudah menunjukkan antusiasme dalam menceritakan proyek yang pernah kamu kerjakan. Namun, ada beberapa hal yang bisa kamu perbaiki agar ceritamu lebih meyakinkan. Berikut adalah beberapa saran yang bisa kamu pertimbangkan untuk meningkatkan kualitas ceritamu:",
  jobsKeywords: ["Frontend Developer", "React", "Node.js", "Express.js", "MongoDB", "RESTful API"],
  resumeKeywords: ["Frontend Developer", "React", "Node.js", "Express.js", "MongoDB", "RESTful API"],
  improvement: [
    "Meskipun kamu sudah menunjukkan antusiasme, ada baiknya jika kamu bisa lebih bersemangat lagi ketika menceritakan tentang proyek yang menurutmu paling membanggakan. Semangatmu bisa menular dan membuat kami lebih tertarik dengan apa yang kamu kerjakan.",
    "Ketika menceritakan tentang pencapaianmu dalam meningkatkan konversi, coba berikan contoh yang lebih spesifik. Misalnya, fitur apa yang kamu kembangkan dan bagaimana fitur tersebut mempengaruhi perilaku pengguna? Dengan contoh yang konkret, kamu bisa lebih meyakinkan kami akan dampak positif yang kamu berikan.",
    "Meskipun kamu sudah menunjukkan antusiasme, ada baiknya jika kamu bisa lebih bersemangat lagi ketika menceritakan tentang proyek yang menurutmu paling membanggakan. Semangatmu bisa menular dan membuat kami lebih tertarik dengan apa yang kamu kerjakan.",
    "Ketika menceritakan tentang pencapaianmu dalam meningkatkan konversi, coba berikan contoh yang lebih spesifik. Misalnya, fitur apa yang kamu kembangkan dan bagaimana fitur tersebut mempengaruhi perilaku pengguna? Dengan contoh yang konkret, kamu bisa lebih meyakinkan kami akan dampak positif yang kamu berikan.",
    "Meskipun kamu sudah menunjukkan antusiasme, ada baiknya jika kamu bisa lebih bersemangat lagi ketika menceritakan tentang proyek yang menurutmu paling membanggakan. Semangatmu bisa menular dan membuat kami lebih tertarik dengan apa yang kamu kerjakan.",
    "Ketika menceritakan tentang pencapaianmu dalam meningkatkan konversi, coba berikan contoh yang lebih spesifik. Misalnya, fitur apa yang kamu kembangkan dan bagaimana fitur tersebut mempengaruhi perilaku pengguna? Dengan contoh yang konkret, kamu bisa lebih meyakinkan kami akan dampak positif yang kamu berikan.",
    "Meskipun kamu sudah menunjukkan antusiasme, ada baiknya jika kamu bisa lebih bersemangat lagi ketika menceritakan tentang proyek yang menurutmu paling membanggakan. Semangatmu bisa menular dan membuat kami lebih tertarik dengan apa yang kamu kerjakan.",
    "Ketika menceritakan tentang pencapaianmu dalam meningkatkan konversi, coba berikan contoh yang lebih spesifik. Misalnya, fitur apa yang kamu kembangkan dan bagaimana fitur tersebut mempengaruhi perilaku pengguna? Dengan contoh yang konkret, kamu bisa lebih meyakinkan kami akan dampak positif yang kamu berikan.",
  ],
};

const CVAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [result, setResult] = useState<CvResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name);
        setPdfFile(file);
      } else {
        alert("Please upload a PDF file.");
        setFileName("");
        setPdfFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file before submitting.");
      return;
    }
    if (!jobTitle || !jobDescription) {
      toast.error("Please fill in the job title and job description before submitting.");
      return;
    }
    try {
      const result = await analyzeCV(pdfFile, jobTitle, jobDescription);
      setResult(result);
      setResult(dummyResult);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="flex flex-row w-full px-12 gap-12 py-12">
        <div className="h-full w-[40%] flex flex-col gap-8 ">
          <div className="font-bold text-4xl text-center  text-primary-blue">Analyze your resume!</div>

          {/* Job Title Input */}
          <input
            type="text"
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Title"
          />

          {/* Job Description Input */}
          <textarea
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-72 text-start border-primary-blue border-1 border rounded-md py-4 px-4 text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Description"
          />

          {/* File Upload Section */}
          <div className="flex flex-row w-full">
            <div className="flex flex-row justify-between items-center cursor-pointer px-8 py-6 bg-white  border-2 border-primary-blue w-full  rounded-lg text-start">
              <div className="font-semibold text-primary-blue text-xl text-ellipsis">{fileName ? fileName : "Upload your CV (PDF only)"}</div>
              <label htmlFor="fileUpload" className="flex items-center justify-center cursor-pointer py-4 px-6 bg-button-color text-white font-bold rounded-lg">
                Upload
              </label>
            </div>
            <input type="file" id="fileUpload" onChange={handleFileUpload} accept="application/pdf" className="hidden" />
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="bg-button-color text-white text-xl font-semibold py-3 px-6 rounded-lg mt-4">
            Analyze
          </button>
        </div>
        {/* result */}
        {result && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6">
              <div className="flex flex-col rounded-lg gap-2 bg-white p-4">
                <div className="text-xl font-bold">Jobs keywords</div>
                <div className="flex flex-wrap">
                  {result.jobsKeywords.map((keyword: string, index: number) => (
                    <div key={index} className="bg-primary-blue text-white rounded-lg py-2 px-4 m-1">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-lg gap-2 bg-white p-4">
                <div className="text-xl font-bold">Your resume keywords</div>
                <div className="flex flex-wrap">
                  {result.resumeKeywords.map((keyword: string, index: number) => (
                    <div key={index} className="bg-primary-blue text-white rounded-lg py-2 px-4 m-1">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full bg-white rounded-lg p-10 px-12 gap-4 h-fit">
              <h1 className="text-3xl font-bold">Summary of Analysis</h1>
              <div className="font-semibold text-justify text-lg">{result.summary}</div>
              <div className="font-semibold flex flex-col gap-2 text-lg">
                <h1 className="text-2xl font-bold">Improvement</h1>
                <div className="flex flex-col gap-4 list-outside">
                  {result.improvement.map((item: string, index: number) => (
                    <div key={index} className="flex flex-row gap-1">
                      <li />
                      <div>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CVAnalyzer;
