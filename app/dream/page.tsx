"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { themeType, themes } from "../../utils/dropdownTypes";

// Configuration for the uploader
const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#2563EB", // Primary buttons & links
      error: "#d23f4d", // Error messages
      shade100: "#000", // Standard text
      shade200: "#444e", // Secondary button text
      shade300: "#fffd", // Secondary button text (hover)
      shade400: "#000c", // Welcome text
      shade500: "#fff9", // Modal close button
      shade600: "#4447", // Border
      shade700: "#fff2", // Progress indicator background
      shade800: "#fff1", // File item background
      shade900: "#ffff", // Various (draggable crop buttons, etc.)
    },
  },
};

export default function DreamPage() {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Man");

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);

    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl, theme }),
    });
    if(res.status === 429){
      setError("You have attempted too many runs today. Please try again in 24 hours");
    } else {
      let webhookUrl = await res.json();
      console.log("webhookUrl:", webhookUrl);

      // Loop until able to get Replicate result
      while (!restoredImage) {
        console.log("polling for result...");
        let genResponse = await fetch("/prediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hookUrl: webhookUrl })
        });
        let finalResponse = await genResponse.json();
        console.log("finalResponse:", finalResponse);

        // If response is an image with URL from Replicate
        if(finalResponse.startsWith("https://")) {
          setRestoredImage(finalResponse);
          break;
        } else if (finalResponse === "Failed to restore image") {
          console.log("Failed to generate headshot");
          setError("Could not find a face in the image, please try again and make sure your face is centered")
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black-800 sm:text-6xl mb-5">
          Generate your <span className="text-blue-600">Professional</span> headshot
        </h1>
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {!restoredImage && (
                <>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex mt-3 items-center space-x-3">
                      <Image
                        src="/number-1-black.svg"
                        width={30}
                        height={30}
                        alt="1 icon"
                      />
                      <p className="text-left font-medium">
                        Choose your gender
                      </p>
                    </div>
                    <DropDown
                      theme={theme}
                      setTheme={(newTheme) =>
                        setTheme(newTheme as typeof theme)
                      }
                      themes={themes}
                    />
                  </div>
                  <div className="mt-4 mb-2 w-full max-w-sm">
                    <div className="flex mt-6 w-96 items-center space-x-3">
                      <Image
                        src="/number-2-black.svg"
                        width={30}
                        height={30}
                        alt="1 icon"
                      />
                      <p className="text-left font-medium">
                        Upload a picture of your face
                      </p>
                    </div>
                  </div>
                </>
              )}
              <div
                className={`${
                  restoredLoaded ? "visible mt-6 -ml-8" : "invisible"
                }`}
              >
              </div>
              {!originalPhoto && <UploadDropZone />}
              {originalPhoto && !restoredImage && (
                <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl h-96"
                  width={400}
                  height={400}
                />
              )}
              {restoredImage && originalPhoto && (
                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                  <div>
                    <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
                    <Image
                      alt="original photo"
                      src={originalPhoto}
                      className="rounded-2xl relative w-full h-96"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg">Generated Headshot</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <Image
                        alt="restored photo"
                        src={restoredImage}
                        className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                        width={400}
                        height={400}
                        onLoadingComplete={() => setRestoredLoaded(true)}
                      />
                    </a>
                  </div>
                </div>
              )}
              {loading && (
                <button
                  disabled
                  className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                >
                  <span className="pt-4">
                    <LoadingDots color="white" style="large" />
                  </span>
                </button>
              )}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="flex space-x-8 justify-center">
                {originalPhoto && !loading && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                    }}
                    className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                  >
                    Generate another Headshot
                  </button>
                )}
                {restoredLoaded && (
                  <button
                    onClick={() => {
                      downloadPhoto(
                        restoredImage!,
                        appendNewToName(photoName!)
                      );
                    }}
                    className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                  >
                    Download generated Headshot
                  </button>
                )}
              </div>
                {restoredLoaded && (
                  <div className="flex flex-col items-center mt-14 mb-6">
                    <p className="flex justify-center font-small text-gray-700">
                      Generated headshots are automatically deleted after 1 hour. 
                      Be sure to download and share!
                    </p>
                    <p className="mb-6">
                      <Link target="_blank" href="https://twitter.com/search?q=%23proheadshot">
                        <span className="text-blue-600">#proheadshot</span>
                      </Link>
                    </p>
                    <Link href="https://buymeacoffee.com/lucataco" target="_blank">
                      <Image
                        width="200"
                        height="100"
                        src="/bmac.png"
                        alt="Buy me a Coffee"
                      />
                    </Link>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
}
