"use client"
import { useState } from "react"
import { Pencil, X } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"

type FormTitleProps = {
    initialData: {
        title: string
    }
    courseId: string
}


const FormTitle = ({initialData, courseId}: FormTitleProps) => {
    const formSchema = z.object({
        title: z.string().min(2, {
          message: "Title is required.",
        }),
      })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData.title || "",
        },
    })
    const {isSubmitting, isValid} = form.formState
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)


    const toggleEdit = () => {
        setIsEditing(prev => !prev)
    }
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        if (values.title.trim() === initialData.title.trim()) {
            toggleEdit()
            toast.success("No changes made")
            return
        }
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
        form.reset({
            title: initialData.title || "",
        })
        toggleEdit()
    }

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold">Course title</h2>
                <Button onClick={isEditing ? handleCancel : toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
            {isEditing && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input 
                                disabled={isSubmitting}
                                placeholder="e.g. Generative AI" 
                                {...field} 
                                className="bg-white"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            
                                <Button onClick={handleCancel} type="button" variant="outline">
                                    Cancel
                                </Button>
                           
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>

    )
}

export default FormTitle