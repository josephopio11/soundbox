import { Card, CardContent } from "@/components/ui/card";
import { readdir } from "fs/promises";
import { Folder, Music } from "lucide-react";
import Link from "next/link";
import { join } from "path";

async function getAudioFolders() {
  try {
    const audiosPath = join(process.cwd(), "public", "audios");
    const folders = await readdir(audiosPath, { withFileTypes: true });
    return folders
      .filter((folder) => folder.isDirectory())
      .map((folder) => folder.name);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage() {
  const folders = await getAudioFolders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold text-white">Sound Box</h1>
          </div>
          <p className="text-xl text-white/90">
            Choose a music folder to explore!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {folders.map((folder) => (
            <Link key={folder} href={`/folder/${encodeURIComponent(folder)}`}>
              <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 capitalize">
                    {folder.replace(/-/g, " ")}
                  </h3>
                  <p className="text-gray-600 mt-2">Click to explore music!</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">
                Add New Folder
              </h3>
              <p className="text-gray-600 mt-2">
                Create a new music collection!
              </p>
            </CardContent>
          </Card> */}
        </div>

        {folders.length === 0 && (
          <div className="text-center mt-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Music Yet!
              </h3>
              <p className="text-gray-600">
                Create your first folder in the /public/audios directory to get
                started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
