"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import  {ourFileRouter} from "@/app/api/uploadthing/core"
import { toast } from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

interface AttachmentUploadProps {
    onChange: (data: {name: string, url: string}) => void;
    endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({onChange, endpoint}: FileUploadProps) {
  return (
    <div className="flex flex-col items-center justify-between p-6 bg-white">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          // toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error?.message}`);
        }}
      />
    </div>
  );
}


export function AttachmentUpload({onChange, endpoint}: AttachmentUploadProps) {
  return (
    <div className="flex flex-col items-center justify-between p-6 bg-white">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const {name, url} = res?.[0]
            onChange({name, url});
            // toast.success("Upload Completed");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error?.message}`);
        }}
      />
    </div>
  );
}
