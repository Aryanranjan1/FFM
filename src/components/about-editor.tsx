"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { getBioSuggestions } from '@/app/actions';
import { Loader2, Wand2, Clipboard, Check } from 'lucide-react';
import { Separator } from './ui/separator';

const formSchema = z.object({
  currentBio: z.string().min(10, "Current bio is too short."),
  latestWorkDescription: z.string().min(10, "Please describe your latest work."),
});

type AboutEditorProps = {
  initialBio: string;
  artistName: string;
  onSave: (newBio: string) => void;
  onCancel: () => void;
};

type Suggestions = {
  suggestedUpdates: string;
  marketingHooks: string;
};

export function AboutEditor({ initialBio, artistName, onSave, onCancel }: AboutEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentBio: initialBio,
      latestWorkDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getBioSuggestions({
      artistName,
      currentBio: values.currentBio,
      latestWorkDescription: values.latestWorkDescription,
    });
    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      // Handle error, maybe show a toast
      console.error(result.error);
    }
    setIsLoading(false);
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = () => {
    onSave(form.getValues('currentBio'));
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Edit Biography</CardTitle>
            <CardDescription>Update your bio and get AI-powered suggestions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="currentBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Biography</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your current bio..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latestWorkDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latest Work & Style</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your latest work, themes, and artistic style..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Suggestions
            </Button>
            {suggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6"
              >
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-headline text-xl">Suggested Bio Update</h3>
                  <div className="relative">
                    <Textarea readOnly value={suggestions.suggestedUpdates} rows={8} className="bg-muted" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(suggestions.suggestedUpdates, 'bio')}
                    >
                      {copied === 'bio' ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={() => form.setValue('currentBio', suggestions.suggestedUpdates)}>
                    Use this version
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-xl">Marketing Hooks</h3>
                   <div className="relative">
                    <Textarea readOnly value={suggestions.marketingHooks} rows={4} className="bg-muted" />
                     <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(suggestions.marketingHooks, 'hooks')}
                    >
                      {copied === 'hooks' ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
