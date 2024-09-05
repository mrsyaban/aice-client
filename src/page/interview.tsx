import { useState, useRef, useEffect } from "react";
import { Camera, Pause, Play, Square, RotateCcw, Send } from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useSearchParams } from 'react-router-dom';

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

  const [searchParams] = useSearchParams();
  const question = searchParams.get("question") || "Interview Question";

  useEffect(() => {
    const setupCamera = async () => {
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
    };

    setupCamera();

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
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
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
    console.log("Submitting video:", recordedVideoUrl);
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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Navbar isHome={false} />
      <div className="flex flex-col px-[15%] 2xl:px-[25%] py-12 gap-8 items-center">
        <div className="flex w-full text-white font-bold text-2xl bg-primary-blue py-4 justify-start px-12 rounded-lg">{question}</div>
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <video 
              ref={videoRef} 
              className="w-full h-auto" 
              autoPlay 
              playsInline 
              muted={isRecording || !recordedVideoUrl} 
              controls={!!recordedVideoUrl} 
            />
            {!recordedVideoUrl && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {formatTime(timer)} / {formatTime(MAX_DURATION)}
              </div>
            )}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {!recordedVideoUrl ? (
                !isRecording ? (
                  <button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3">
                    <Camera size={24} />
                  </button>
                ) : (
                  <>
                    <button onClick={pauseRecording} className="bg-primary-blue hover:bg-yellow-600 text-white rounded-full p-3">
                      {isPaused ? <Play size={24} /> : <Pause size={24} />}
                    </button>
                    <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3">
                      <Square size={24} />
                    </button>
                  </>
                )
              ) : (
                <>
                  <button onClick={retakeVideo} className="bg-primary-blue hover:bg-opacity-75 text-white rounded-full p-3">
                    <RotateCcw size={24} />
                  </button>
                  <button onClick={submitVideo} className="bg-button-color hover:opacity-75 text-white rounded-md flex flex-row items-center font-bold text-lg gap-3 py-2 px-4">
                    Analyze
                    <Send size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Interview;
