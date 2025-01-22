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
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"

interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea";
  minLength?: number;
}

type GenericFormProps<T extends { [key: string]: any }> = {
  initialData: T;
  courseId: string;
  fieldConfig: FormFieldConfig;
}

const GenericForm = <T extends { [key: string]: any }>({ 
  initialData, 
  courseId, 
  fieldConfig 
}: GenericFormProps<T>) => {
    const formSchema = z.object({
      [fieldConfig.name]: z.string().min(fieldConfig.minLength || 2, {
        message: `${fieldConfig.label} is required.`,
      }),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            [fieldConfig.name]: initialData[fieldConfig.name] || "",
        },
    })
    
    const { isSubmitting, isValid } = form.formState
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing(prev => !prev)
    
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        // ensure it updates only when the field is changed. if values remains same, no need to update
        if (values[fieldConfig.name].trim() === initialData[fieldConfig.name].trim()) {
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
            [fieldConfig.name]: initialData[fieldConfig.name] || "",
        })
        toggleEdit()
    }

    const Field = fieldConfig.type === "input" ? Input : Textarea

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                {fieldConfig.label}
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
            {!isEditing && (
              <p className={cn(
                "text-sm mt-2",
                !initialData[fieldConfig.name] && "text-muted-foreground italic"
              )}>
                {initialData[fieldConfig.name] || `No ${fieldConfig.name}`}
              </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-8 mt-8">
                        <FormField
                          control={form.control}
                          name={fieldConfig.name as any}
                          render={({ field }) => (
                              <FormItem>
                              <FormControl>
                                  <Field
                                    disabled={isSubmitting}
                                    placeholder={fieldConfig.placeholder}
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

export default GenericForm;