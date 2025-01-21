const CourseProgress = ({value}: {value: number}) => {
    return (
        <div>
            <span className="font-medium">{value*100}%</span>
        </div>
    )
}

export default CourseProgress