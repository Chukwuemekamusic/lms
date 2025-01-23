"use client"
import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle, X,File, Trash2, Loader2 } from "lucide-react"
import { truncateUrl } from "@/lib/tools"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Course, Attachment } from "@prisma/client"
import Image from "next/image"
import FileUpload, { AttachmentUpload } from "@/components/FileUpload"


type FormAttachmentProps = {
    initialData: Course & {
        attachments: Attachment[]
    }
    courseId: string
}


const FormAttachment= ({initialData, courseId}: FormAttachmentProps) => {

    const formSchema = z.object({
        name: z.string().min(2),
        url: z.string().min(2),
      })
    
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

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

    const handleDelete = async(attachmentId: string) => {
        // TODO: delete attachment from uploadthings
        try {
            setDeletingId(attachmentId)
            await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`)
            toast.success("Attachment deleted")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete attachment")
        } finally {
            setDeletingId(null)
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
                        <div key={attachment.id} className="flex items-center p-3 w-full text-sky-700 bg-sky-100 border border-sky-200 rounded-md justify-between">
                            <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <p className="text-sm line-clamp-1">{attachment.name}</p>
                            </div>
                            {deletingId === attachment.id && (
                                <div className="flex items-center">
                                    <Loader2 className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
                                </div>
                            )}
                            {deletingId !== attachment.id && (
                            <div onClick={() => handleDelete(attachment.id)} className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
                            </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isEditing && (
                <div className=" mt-4">
                    <AttachmentUpload
                        endpoint="courseAttachment"
                        onChange={async (data) => {
                            if (data) {
                                await onSubmit(data)
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