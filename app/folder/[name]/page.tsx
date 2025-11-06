import AudioPlayer from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { readdir } from "fs/promises";
import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";
import { join } from "path";

async function getAudioFiles(folderName: string) {
  try {
    const folderPath = join(process.cwd(), "public", "audios", folderName);
    const files = await readdir(folderPath);
    return files.filter(
      (file) =>
        file.endsWith(".mp3") ||
        file.endsWith(".wav") ||
        file.endsWith(".ogg") ||
        file.endsWith(".m4a")
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function FolderPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const audioFiles = await getAudioFiles(decodedName);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/90 hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white capitalize">
              {decodedName.replace(/-/g, " ")}
            </h1>
          </div>
          <p className="text-xl text-white/90">
            {audioFiles.length} song{audioFiles.length !== 1 ? "s" : ""} to
            enjoy!
          </p>
        </div>

        {audioFiles.length > 0 ? (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {audioFiles.map((file, index) => (
              <AudioPlayer
                key={file}
                fileName={file}
                filePath={`/audios/${decodedName}/${file}`}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Music Files!
              </h3>
              <p className="text-gray-600">
                Add some audio files to the /public/audios/{decodedName} folder
                to see them here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
