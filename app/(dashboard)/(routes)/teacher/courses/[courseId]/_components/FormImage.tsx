"use client"
import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle, X, Copy, Check } from "lucide-react"
import { truncateUrl } from "@/lib/tools"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import Image from "next/image"
import FileUpload from "@/components/FileUpload"


type FormImageProps = {
    initialData: Course
    courseId: string
}


const FormImage= ({initialData, courseId}: FormImageProps) => {

    const [copySuccess, setCopySuccess] = useState("");

    const handleCopy = () => {
        navigator.clipboard.writeText(initialData.imageUrl || "")
            .then(() => {
                setCopySuccess("Copied to clipboard!");
                setTimeout(() => setCopySuccess(""), 1500); // Clear message after 1.5 seconds
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    };


    const formSchema = z.object({
        imageUrl: z.string().min(2, {
          message: "image is required.",
        }),
      })
    
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
    }
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Failed to update course")
        }
    }

    const handleCancel = () => {
        // handle the cancel function
        toggleEdit()
    }

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold">Course image</h2>
                <Button onClick={isEditing ? handleCancel : toggleEdit} variant="ghost">
                    {isEditing && (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
             <p className={cn("text-sm mt-2 flex justify-between items-center", !initialData.imageUrl && "text-muted-foreground italic", initialData.imageUrl && "bg-blue-50 rounded-md p-2")}>
                {truncateUrl(initialData.imageUrl || "No image")}
                {initialData.imageUrl && <Button onClick={handleCopy} variant="outline" className={cn("ml-2", copySuccess && "bg-green-300 text-white hover:bg-green-300 hover:text-white")}>
                            {copySuccess ? <Check className="h-4 w-4 " /> : <Copy className="h-4 w-4 " />}
                </Button>}
            </p>}
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 w-full my-4 bg-zinc-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 h-40 w-full">
                        <Image
                        fill
                        className="object-cover rounded-md"
                        src={initialData.imageUrl}
                        alt="Course image"
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div className=" mt-4">
                    <FileUpload
                        endpoint="courseImage"
                        onChange={async (url) => {
                            if (url) {
                                await onSubmit({imageUrl: url})
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground text-center mt-6">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>

    )
}

export default FormImage