import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const RAILWAY_URL = "https://cloudfilehandling-production.up.railway.app";
  const apiUrl = RAILWAY_URL || "http://localhost:3001";
  //REACT_APP_API_URL ||
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // http://localhost:3001
      await axios.post(`${apiUrl}/upload`, formData);

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: selectedFile.name,
          originalFile: selectedFile,
        },
      ]);
      toast.success("Uploaded Successfully");
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    }
  };

  const handleDelete = async (filename) => {
    try {
      // http://localhost:3001/
      await axios.delete(`${apiUrl}/delete/${filename}`);
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== filename)
      );
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("Failed to delete file");
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-10 text-center text-[#EF476F]">
        File Handling Website
      </h1>
      <div className="flex justify-center">
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file"
          className="h-[250px] w-[375px] rounded-md border-2 border-dashed
          font-extrabold flex items-center justify-center text-[#686DE080] text-3xl sm:text-5xl
          border-[#686DE080] hover:border-[#EF476F] hover:text-[#EF476F] cursor-pointer"
        >
          Upload File
        </label>
      </div>

      <h2 className="mt-5 text-xl font-medium text-[#EF476F]">
        Uploaded Files
      </h2>

      <ul className="space-y-4 mt-3">
        {uploadedFiles.map((file, i) => (
          <li
            key={i}
            className="flex justify-between items-center p-4 rounded-lg bg-gray-100 border border-gray-300 hover:shadow transition-shadow"
          >
            <span className="text-[#686DE080] font-bold">{file.name}</span>
            <div className="space-x-5">
              <a
                href={URL.createObjectURL(file.originalFile)}
                download={file.name}
                className="bg-[#EF476F] text-white px-4 py-2 rounded hover:bg-[#d43d5a] text-md cursor-pointer"
              >
                Download
              </a>
              <button
                onClick={() => handleDelete(file.name)}
                className="bg-[#EF476F] text-white px-4 py-2 rounded hover:bg-[#d43d5a] text-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
