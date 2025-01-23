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
import { Textarea } from "@/components/ui/textarea"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { Combobox } from "@/components/ui/combobox"

type FormCategoryProps = {
    initialData: Course
    courseId: string
    options:{
        label: string
        value: string
    }[]
}


const FormCategory= ({initialData, courseId, options}: FormCategoryProps) => {
    const formSchema = z.object({
        categoryId: z.string().min(1, {
          message: "Description is required.",
        }),
      })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || "",
        },
    })
    const {isSubmitting, isValid} = form.formState
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
    const selectedOption = options.find((option) => option.value === initialData.categoryId)

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold">Course category</h2>
                <Button onClick={toggleEdit} variant="ghost">
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
            {!isEditing &&
             <p className={cn("text-sm mt-2", !initialData.categoryId && "text-muted-foreground italic")}>
                {selectedOption?.label || "No description"}
            </p>
            }
            {isEditing && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Combobox
                                options={options}
                                {...field}
                                />

                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            
                                <Button onClick={toggleEdit} type="button" variant="outline">
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

export default FormCategory