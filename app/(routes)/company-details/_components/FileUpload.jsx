import Image from "next/image";
import { useState } from "react";

const FileUpload = ({ setImages }) => {
  const [imagePreview, setImagePreview] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setImages(files);
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-5 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to Upload</span> or Drag and
              Drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPEG or GIF
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/png, image/gif, image/jpeg"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {imagePreview.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              width={100}
              height={100}
              className="rounded-lg object-scale-down h-[100px] w-[100px]"
              alt={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
