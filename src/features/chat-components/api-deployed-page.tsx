  "use client"

  import { useState, useEffect } from "react"
  import { Check, Copy, ExternalLink, Server } from "lucide-react"
  import Link from "next/link"

  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Separator } from "@/components/ui/separator"
  import { Badge } from "@/components/ui/badge"

  export default function ApiDeployedPage() {
    const [copied, setCopied] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Example API URL - replace with your actual deployed API URL
    const apiUrl = "https://api.example.com/v1"

    // Set dark mode by default
    useEffect(() => {
      document.documentElement.classList.add("dark")
      setMounted(true)
    }, [])

    const copyToClipboard = () => {
      navigator.clipboard.writeText(apiUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    // Don't render until client-side to avoid hydration mismatch with dark mode
    if (!mounted) return null

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b bg-card">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6" />
              <span className="text-lg font-semibold">API Dashboard</span>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">API Successfully Deployed!</h1>
              <p className="text-muted-foreground max-w-md">
                Your API is now live and ready to use. You can access it using the URL below.
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Endpoint
                </CardTitle>
                <CardDescription>Your API is accessible at the following URL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <code className="text-sm font-mono">{apiUrl}</code>
                  <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy API URL</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-green-500 bg-green-500/10">
                    Online
                  </Badge>
                  <span>Deployed 2 minutes ago</span>
                </div>
              </CardFooter>
            </Card>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">API Documentation</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Home Page</CardTitle>
                  <CardDescription>Your API includes a home page with documentation and examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg bg-card border overflow-hidden relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="text-xl font-medium mb-2">API Documentation</h3>
                      <p className="text-muted-foreground mb-4">
                        Comprehensive guides and examples to help you integrate with our API
                      </p>
                      <Button asChild>
                        <Link href={apiUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          Visit Documentation
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Getting Started</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-medium">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Authentication</h3>
                        <p className="text-sm text-muted-foreground">Use your API key to authenticate requests</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-medium">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Make Your First Request</h3>
                        <p className="text-sm text-muted-foreground">
                          Send a GET request to <code className="text-xs">{apiUrl}/hello</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-medium">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Explore the Documentation</h3>
                        <p className="text-sm text-muted-foreground">
                          Visit the documentation to learn about all available endpoints
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <footer className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="#">Support</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#">Status</Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    )
  }

