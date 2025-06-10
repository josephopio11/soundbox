"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Download, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  fileName: string;
  filePath: string;
  index: number;
}

export default function AudioPlayer({
  fileName,
  filePath,
  index,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const colors = [
    "from-red-400 to-pink-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-blue-500",
    "from-yellow-400 to-orange-500",
    "from-purple-400 to-pink-500",
    "from-indigo-400 to-blue-500",
  ];

  const colorClass = colors[index % colors.length];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayName = fileName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
      <CardContent className="p-6">
        <audio ref={audioRef} src={filePath} preload="metadata" />

        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="w-full h-full rounded-full hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate mb-2">
              {displayName}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  className="flex-1 [&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-500 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-gradient-to-r [&>span:first-child_span]:from-purple-500 [&>span:first-child_span]:to-pink-500"
                />
                <span className="text-sm text-gray-600 w-12">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-blue-500"
                />
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
