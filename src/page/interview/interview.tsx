import { useState, useRef, useEffect } from "react";
import { Camera, Pause, Play, Square, RotateCcw, Send } from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addInterview, addInterviewById } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";


const MAX_DURATION = 10 * 60;

const Interview = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [videoUploaded, setVideoUploaded] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState<string>("");
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState<string>("");

  const submitVideoUpload = () => {
    if (!question) {
      toast.error("Please provide a question before uploading the video.");
      return;
    }
    if (!videoUploaded) {
      toast.error("Please select a video to upload.");
      return;
    }

    if (videoUploaded) {
      (async () => {
        try {
          let message = "";
          if (!questionId) {
            message = await addInterview(question, videoUploaded);
          } else {
            message = await addInterviewById(questionId, videoUploaded);
          }
          console.log("Upload successful:", message);
          toast.success(message);
          navigate(0);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      })();
    }
  };

  useEffect(() => {
    const questionId = searchParams.get("id") || "";
    setQuestionId(questionId);
    (async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(videoStream);

        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          };
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    })();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);

        // Reset video element to display the recorded video
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        pauseTimer();
        setIsPaused(true);
      } else {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      setDuration(timer);
    }
  };

  const retakeVideo = () => {
    setRecordedVideoUrl(null);
    recordedChunks.current = [];
    setTimer(0);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => console.error("Error playing video:", error));
    }
  };

  const submitVideo = () => {
    if (question)
      (async () => {
        try {
          const blob = new Blob(recordedChunks.current, { type: "video/mp4" });
          const file = new File([blob], "interview-video.mp4", { type: "video/mp4" });
          let message = "";
          if (!questionId) {
            message = await addInterview(question, file);
          } else {
            message = await addInterviewById(questionId, file);
          }
          console.log("Upload successful:", message);
          toast.success(message);
          navigate(0);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      })();
  };

  const startTimer = () => {
    if (timerIntervalRef.current !== null) window.clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer >= MAX_DURATION - 1) {
          stopRecording();
          return MAX_DURATION;
        }
        return prevTimer + 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
    }
  };

  const stopTimer = () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    // console.log("Duration:", duration);
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [recordedVideoUrl, duration]);

  return (
    <>
      <Toaster />
      <Navbar isHome={false} />
      <div className="flex flex-col px-[15%] 2xl:px-[25%] py-12 gap-8 items-center">
        <div className="text-3xl font-bold text-primary-blue">Interview Grader</div>
        <textarea
          placeholder="Put your interview question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex h-fit w-full items-center text-primary-blue px-4 font-semibold text-2xl bg-white border-2 border-primary-blue py-4 rounded-lg"
        />
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <video ref={videoRef} className="w-full h-auto" autoPlay playsInline muted={isRecording || !recordedVideoUrl} />
            {!recordedVideoUrl && !isRecording && (
              <div className="absolute inset-0 flex-col gap-2 bg-black bg-opacity-70 flex items-center justify-center">
                <button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4">
                  <Camera size={32} />
                </button>
                <div className="font-bold text-white">Start Recording</div>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">{formatTime(timer)}</span>
              </div>
            )}
            {recordedVideoUrl && (
              <div className="absolute flex flex-row gap-4 justify-between bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <div className="flex w-full items-center justify-between gap-2">
                  <button onClick={handlePlayPause} className="focus:outline-none">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <input type="range" min={0} max={duration} value={currentTime} onChange={handleSeek} className="w-full mx-4 bg-primary-blue" />
                  <div className="text-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-2">
                  <button onClick={retakeVideo} className="bg-primary-blue  text-white rounded-full p-2">
                    <RotateCcw size={20} />
                  </button>
                  <button onClick={submitVideo} className="bg-button-color text-white rounded-full p-2 flex items-center">
                    <Send size={20} />
                    <span className="ml-2">Analyze</span>
                  </button>
                </div>
              </div>
            )}
            {isRecording && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button onClick={pauseRecording} className="bg-primary-blue hover:bg-opacity-80 text-white rounded-full p-3">
                  {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
                <button onClick={stopRecording} className="bg-red-700 hover:bg-opacity-80 text-white rounded-full p-3">
                  <Square size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-primary-blue font-semibold text-md"> or you can directly upload your interview record here</div>
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-row w-full">
            <div className="flex flex-row gap-4 justify-between items-center cursor-pointer px-8 py-6 bg-white  border-2 border-primary-blue w-full  rounded-lg text-start">
              <div className="font-semibold text-primary-blue text-xl text-ellipsis">{fileName ? fileName : "Upload your interview video (mp4)"}</div>
              <label htmlFor="videoUploader" className="flex items-center justify-center cursor-pointer py-4 px-6 bg-primary-blue text-white font-bold rounded-lg">
                Upload
              </label>
            </div>
            <input
              id="videoUploder"
              type="file"
              accept="*.mp4"
              onChange={(e) => {
                const fileTemp = e.target.files?.[0] || null;
                if (!fileTemp) return;
                setFileName(fileTemp.name);
                setVideoUploaded(fileTemp);
              }}
              className="hidden"
            />
          </div>
          <button onClick={submitVideoUpload} className="bg-button-color text-white rounded-lg p-2 flex items-center">
            <Send size={20} />
            <span className="ml-2 font-bold">Analyze</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Interview;
