"use client"
import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle, X, Copy } from "lucide-react"
import { truncateUrl } from "@/lib/tools"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Course, Attachment } from "@prisma/client"
import Image from "next/image"
import FileUpload from "@/components/FileUpload"


type FormAttachmentProps = {
    initialData: Course & {
        attachments: Attachment[]
    }
    courseId: string
}


const FormAttachment= ({initialData, courseId}: FormAttachmentProps) => {

    const [copySuccess, setCopySuccess] = useState("");

    const handleCopy = () => {
        navigator.clipboard.writeText(initialData.imageUrl || "")
            .then(() => {
                setCopySuccess("Copied to clipboard!");
                setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    };


    const formSchema = z.object({
        url: z.string().min(2),
      })
    
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
    }
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course attachments updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Failed to update course attachments")
        }
    }

    const handleCancel = () => {
        // handle the cancel function
        toggleEdit()
    }
    const hasAttachments = initialData.attachments.length > 0
    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold">Course attachments</h2>
                <Button onClick={isEditing ? handleCancel : toggleEdit} variant="ghost">
                    {isEditing && (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an attachment
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && !hasAttachments && (
                <p className={"text-sm mt-2 flex justify-between items-center"}>
                    No attachments
                </p>
            )}
            {!isEditing && hasAttachments && (
                <div className="mt-2 gap-y-2">
                    {initialData.attachments.map((attachment) => (
                        <p key={attachment.id} className="text-sm">{attachment.name}</p>
                    ))}
                </div>
            )}
            {isEditing && (
                <div className=" mt-4">
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={async (url) => {
                            if (url) {
                                await onSubmit({url: url})
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground text-center mt-6">
                        Upload any relevant files for your course. 
                    </div>
                </div>
            )}
        </div>

    )
}

export default FormAttachment