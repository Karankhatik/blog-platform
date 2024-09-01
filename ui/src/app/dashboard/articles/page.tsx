import ArticleList from '@/components/article/ArticleList';


const Chapters = () => {
  return (
    <div className='p-2 md:p-2 md:pl-12 lg:p-6 lg:pl-12'>
      <h3 className="text-2xl font-bold mb-4 pl-4">Articles</h3>    
      <ArticleList/> 
    </div>
  )
}

export default Chapters