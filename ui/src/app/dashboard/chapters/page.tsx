import ChapterList from '@/components/chapters/ChaptersList';


const Chapters = () => {
  return (
    <div className='p-2 md:p-2 md:pl-12 lg:p-6 lg:pl-12'>
      <h3 className="text-2xl font-bold mb-4">Chapters List</h3>    
      <ChapterList/> 
    </div>
  )
}

export default Chapters