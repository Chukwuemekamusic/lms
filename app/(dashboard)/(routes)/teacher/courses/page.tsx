import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TeacherCoursesPage = () => {
    return (
        <div className="p-6">
            <Link href="/teacher/create">
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Course
                </Button>
            </Link>
        </div>
    )
}

export default TeacherCoursesPage;