import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import { Sparkles, Coins, FileText, CheckCircle2, Copy } from "lucide-react"
import { Card, CardHeader, CardContent } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import createToken from "@/utils/createToken"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  TokenName: z.string().min(2, {
    message: "Token name must be at least 2 characters."
  }).max(20, {
    message: "Token name cannot exceed 20 characters."
  }),
  ImageUrl: z.string().url({
    message: "Please enter a valid URL."
  }).optional(),
  InitialSupply: z.number().positive({
    message: "Supply must be a positive number."
  }),
  Symbol: z.string().min(2, {
    message: "Symbol must be at least 2 characters."
  }).max(8, {
    message: "Symbol cannot exceed 8 characters."
  }),
  Decimal: z.number().min(0, {
    message: "Decimals must be at least 0."
  }).max(18, {
    message: "Decimals cannot exceed 18."
  }),
  RevokeMint: z.boolean(),
  RevokeFreeze: z.boolean(),
  Description: z.union([ 
    z.string().min(8, {
      message: "Description must be at least 8 characters."
    }).max(50, {
      message: "Description cannot exceed 50 characters."
    }),
    z.string().max(0)
  ]).optional()
})

export type FormSchema = z.infer<typeof formSchema>

const TokenLaunchpadForm = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TokenName: "",
      ImageUrl: "",
      InitialSupply: 1000,
      Symbol: "",
      Decimal: 9,
      RevokeMint: false,
      RevokeFreeze: false,
      Description: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    setTokenAddress(null)

    try {
      const data = await createToken(connection, publicKey, values, sendTransaction)
      toast.success("Token created successfully!")
      setTokenAddress(data.mintAddress)
      form.reset()
    } catch (error: any) {
      console.error("Error creating token:", error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (tokenAddress) {
      navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Address copied to clipboard")
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("ImageUrl", URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Launch Your Solana Token</h2>
        <p className="text-muted-foreground">Create and deploy your custom token on the Solana blockchain in minutes</p>
      </div>

      <Card className="border-border shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 dark:from-blue-500/90 dark:to-purple-500/90 p-6 border-b border-border/50">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-white" />
            <h1 className="text-xl font-bold text-white">Token Creator</h1>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {tokenAddress && (
            <Alert className="mb-8 bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400">
              <div className="flex items-start">
                <Sparkles className="h-4 w-4 mt-0.5" />
                <div className="ml-2">
                  <AlertTitle className="font-medium mb-2">Token Created Successfully!</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold">Token Address:</span>
                      <code className="px-2 py-1 bg-green-500/10 rounded text-sm font-mono">{tokenAddress}</code>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 rounded hover:bg-background/80 transition-colors"
                        aria-label="Copy address to clipboard"
                      >
                        {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-5">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Coins className="h-5 w-5 text-blue-500" />
                    Token Details
                  </h3>

                  <FormField
                    control={form.control}
                    name="TokenName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Token Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., My Awesome Token" {...field} className="focus-visible:ring-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MAT" {...field} className="focus-visible:ring-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="InitialSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Initial Supply</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 1000000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Decimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Decimals</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 9"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>Standard is 9 decimals for Solana tokens</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Metadata & Settings
                  </h3>

                  <FormField
                    control={form.control}
                    name="ImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Upload Image</FormLabel>
                        <FormControl>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {imagePreview && (
                    <div className="mt-2">
                      <h4 className="font-medium">Image Preview:</h4>
                      <img src={imagePreview} alt="Uploaded token image" className="mt-2 w-32 h-32 object-cover rounded" />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A short description of your token..."
                            {...field}
                            className="focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RevokeMint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Revoke Minting</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Prevent further minting of this token</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RevokeFreeze"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Revoke Freezing</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Prevent freezing of token accounts</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2"
              >
                {isSubmitting ? "Creating Token..." : "Create Token"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TokenLaunchpadForm
