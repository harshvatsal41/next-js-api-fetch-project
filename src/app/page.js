"use client"
import Image from "next/image";
import {useState} from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadImage = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text(); // Capture error details
        console.error("Upload failed:", errorData);
        setMessage(`Failed to upload: ${errorData}`);
        return;
      }

      const data = await response.json();
      setMessage(`Image uploaded successfully! Path: ${data.path}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };



  return (
      <div
          className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
          <h1 className="text-xl font-bold mb-5">Upload Image</h1>
          <form onSubmit={uploadImage} className="space-y-4">
            <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
                type="submit"
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
          {message && (
              <p
                  className={`mt-3 text-sm ${
                      message.includes("successfully") ? "text-green-500" : "text-red-500"
                  }`}
              >
                {message}
              </p>
          )}
        </div>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
            />
            Learn
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
            />
            Examples
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
  );
}
