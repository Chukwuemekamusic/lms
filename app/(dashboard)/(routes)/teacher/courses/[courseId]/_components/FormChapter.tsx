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

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Course, Chapter } from "@prisma/client"
import ChapterList from "./ChapterList"

type FormChapterProps = {
    initialData: Course & {
        chapters: Chapter[]
    }
    courseId: string
}


const FormChapter= ({initialData, courseId}: FormChapterProps) => {
    const formSchema = z.object({
        title: z.string().min(2, {
          message: "Title is required.",
        }),
      })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })
    const {isSubmitting, isValid} = form.formState
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const toggleCreate = () => {
        setIsCreating(prev => !prev)
    }
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success(`Chapter created: ${values.title}`)
            toggleCreate()
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error("Failed to update course")
        }
    }

    const onReOrder = async(bulkUpdateData: {id: string, position: number}[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: bulkUpdateData})
            toast.success("Chapters reordered")
            router.refresh()
        } catch (error) {
            toast.error("Failed to reorder chapters")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold">Course chapters</h2>
                <Button onClick={toggleCreate} variant="ghost">
                    {isCreating ? (
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
            
            {!isCreating &&
             <div className={cn("text-sm mt-2", !initialData.chapters.length && "text-muted-foreground italic")}>
                {!initialData.chapters.length && (
                    <p>No chapters</p>
                )}
                {/* TODO: Display chapters */}
                <ChapterList 
                    items={initialData.chapters || []}
                    onEdit={() => {}}
                    onReorder={onReOrder}
                />
            </div>}
            {isCreating && (
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
                                placeholder="Chapter title" 
                                {...field} 
                                className="bg-white"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            
                                <Button onClick={toggleCreate} type="button" variant="outline">
                                    Cancel
                                </Button>
                           
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && initialData.chapters.length && (
                <p className="text-xs mt-2 text-muted-foreground italic">
                    Drag and drop to reorder chapters
                </p>
            )}
        </div>

    )
}

export default FormChapter