"use client"

import React, { useEffect, useState } from "react"
import { getArticleBySlugAPI } from "@/services/article/article"
import { Article } from "@/types/article"
import "@/styles/article.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface ArticleViewProps {
  params: {
    article: string
  }
}

const ArticleView: React.FC<ArticleViewProps> = ({ params }) => {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (params && params.article) {
      const articleSlug = params.article
      fetchArticle(articleSlug)
    }
  }, [params])

  const fetchArticle = async (slug: string) => {
    setLoading(true)
    try {
      const response = await getArticleBySlugAPI(slug)
      setArticle(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Article not found</h2>
        <Button asChild variant="outline">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
          </Link>
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <nav className="flex mb-4 md:mb-6 text-sm overflow-x-auto whitespace-nowrap">
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
            <li><Link href="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
            <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
            <li className="text-gray-400 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">{article.title}</li>
          </ol>
        </nav>

        <Button
          variant="outline"
          size="sm"
          className="mb-4 md:mb-6 hover:bg-primary hover:text-white transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-xl p-4  "
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">{article.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-400 mb-6 md:mb-8 pb-4 border-b border-gray-700">
            <div className="flex items-center mb-2 sm:mb-0">
              <User className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{article.userId?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>
                {article.updatedAt !== article.createdAt
                  ? `Updated on ${formatDate(article.updatedAt)}`
                  : `Created on ${formatDate(article.createdAt)}`}
              </span>
            </div>
          </div>

          <div
            className="content "
            dangerouslySetInnerHTML={{
              __html: article.content || "",
            }}
          />
        </motion.article>
      </div>
    </div>
  )
}

export default ArticleView