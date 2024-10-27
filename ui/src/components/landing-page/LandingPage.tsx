import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, BookOpen, PenTool } from 'lucide-react'

export const metadata = {
  title: 'TechBlog - Your Daily Dose of Tech News and Insights',
  description: 'Stay ahead of the curve with expert analysis and in-depth articles on the latest tech news, insights, and innovations. Create and manage your own tech articles.',
  openGraph: {
    title: 'TechBlog - Your Daily Dose of Tech News and Insights',
    description: 'Stay ahead of the curve with expert analysis and in-depth articles on the latest tech news, insights, and innovations. Create and manage your own tech articles.',
    images: [{ url: '/techblog-og-image.jpg' }],
  },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">   
      <main className="flex-grow">
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6">
              Welcome to TechBlog
            </h1>
            <p className="text-gray-400 text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              Your daily dose of tech news, insights, and innovations. <br/>
              Stay ahead of the curve with our expert analysis and in-depth articles.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/articles">Read Latest Posts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/register">Sign Up & Start Writing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-background mb-12">Why Choose TechBlog?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BenefitCard 
                icon={<Lightbulb className="h-10 w-10" />} 
                title="Cutting-Edge Insights" 
                description="Gain access to the latest tech trends and innovations, keeping you at the forefront of the industry." 
              />              
              <BenefitCard 
                icon={<BookOpen className="h-10 w-10" />} 
                title="In-Depth Learning" 
                description="Dive deep into complex tech topics with our comprehensive, easy-to-understand articles and analyses." 
              />
              <BenefitCard 
                icon={<PenTool className="h-10 w-10" />} 
                title="Share Your Expertise" 
                description="Create and manage your own tech articles, sharing your knowledge and insights with our growing community." 
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Community of Tech Writers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Create Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Write and publish your own tech articles, sharing your expertise with our global audience.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Easily edit, update, and organize your articles with our intuitive content management system.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/auth/register">Sign Up & Start Writing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}