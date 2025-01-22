"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import  {ourFileRouter} from "@/app/api/uploadthing/core"
import { toast } from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({onChange, endpoint}: FileUploadProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error?.message}`);
        }}
      />
    </main>
  );
}