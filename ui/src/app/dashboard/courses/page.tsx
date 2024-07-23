import CourseList from '@/components/courses/CourseList';


const Courses = () => {
  return (
    <div className='p-2 md:p-2 md:pl-12 lg:p-6 lg:pl-12'>
      <h3 className="text-2xl font-bold mb-4">Course List</h3>    
      <CourseList/> 
    </div>
  )
}

export default Courses