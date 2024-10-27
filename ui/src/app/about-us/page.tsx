import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function AboutPage() {


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About TechBlog</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  TechBlog is your go-to source for the latest in technology news, trends, and insights. We&apos;re passionate about making complex tech topics accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-2 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">Become an Editor</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Interested in sharing your tech insights with our community? Become an editor at TechBlog!
              </p>
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Editorial Team</CardTitle>
                  <CardDescription>Sign up to become an editor and contribute to TechBlog.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To become an editor, simply click the button below. This will open your default email client with a pre-composed message to our team. We`&apos;ll review your request and get back to you soon!
                  </p>
                </CardContent>
                <CardFooter>

                  <Button className="w-full">
                    <Link href="/auth/register">
                      Sign Up to Become an Editor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}