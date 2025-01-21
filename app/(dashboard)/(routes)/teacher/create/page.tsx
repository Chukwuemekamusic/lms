"use client"
 
import axios from "axios";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { toast as hotToast} from "react-hot-toast";



import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const CreateCoursePage = () => {
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
    const {toast} = useToast()

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const {data} = await axios.post("/api/courses", values)
            router.push(`/teacher/courses/${data.id}`)
            hotToast.success("Course Title Created Successfully")
        } catch (error) {
            console.log("[COURSE_CREATE]", error)
            toast({
                title: "Course Title Creation Failed",
                description: "Something went wrong",
                variant: "destructive",
            })
        }
    }

    
    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div className="text-2xl">
                <h1 className="font-bold">Name your course</h1>
                <p className="text-sm text-muted-foreground">No worries, you can change the title later</p>
            
      
                <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-8 mt-8">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                            <Input 
                            disabled={isSubmitting}
                            placeholder="e.g. Generative AI" 
                            {...field} 
                            />
                        </FormControl>
                        <FormDescription>
                            What will you teach in this course?
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href="/teacher/courses">
                            <Button type="button" variant="outline">
                                Back
                            </Button>
                        </Link>
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Continue
                        </Button>
                    </div>
                </form>
                </Form>
            </div>
        </div>
    )
}

export default CreateCoursePage;