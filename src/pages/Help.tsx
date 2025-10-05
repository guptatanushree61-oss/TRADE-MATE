import React, { useState, useRef } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { sendSupportMessage } from '@/lib/support';
import { useAuth } from '@/hooks/useAuth';
import { Mail, LifeBuoy, Info, Phone } from 'lucide-react';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const nameRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuth();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side validation
    if (!name || !email || !message) {
      toast({ title: 'Please fill all fields', description: 'Name, email and a short message are required.' });
      return;
    }

    // Try to send to Supabase
    toast({ title: 'Sending...', description: 'Saving your message...' });
    sendSupportMessage({ name, email, message, user_id: user?.id })
      .then((res) => {
        if (res.error) {
          toast({ title: 'Failed to send', description: res.error.message || 'Please try again later.' });
        } else {
          toast({ title: 'Message sent', description: 'Our support team will contact you shortly.' });
          setName('');
          setEmail('');
          setMessage('');
        }
      })
      .catch((err) => {
        toast({ title: 'Failed to send', description: err?.message || 'Please try again later.' });
      });
  };

  return (
    <SidebarLayout pageTitle={t('nav.help')}>
      <div className="space-y-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('nav.help')}</h1>
          <p className="text-muted-foreground">Find FAQs, contact support, and explore helpful guides.</p>
        </div>

        {/* Hero / quick help */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4 animate-fade-up shadow-sm">
          <div className="w-14 h-14 rounded-lg border border-border bg-white flex items-center justify-center">
            <LifeBuoy className="h-8 w-8 text-primary animate-float" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-black">Need help right away?</div>
            <div className="text-sm text-black/70">Use the contact form or check the FAQs below — our team replies within 24 hours.</div>
          </div>
          <div>
            <Button onClick={() => nameRef.current?.focus()} variant="outline">Contact Support</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 animate-fade-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                <CardTitle>Support Center</CardTitle>
              </div>
              <CardDescription>Get quick help from our resources and support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" defaultValue="faq-1" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>How do I add a product to inventory?</AccordionTrigger>
                  <AccordionContent>
                    Go to Inventory → Add Product. Fill in name, price, and stock. Save to add the product.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>How do I record payments?</AccordionTrigger>
                  <AccordionContent>
                    Use Payments → Add Payment and choose the method (Cash / UPI / Card). Record amount and description.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Where can I export my data?</AccordionTrigger>
                  <AccordionContent>
                    Go to Settings → Data Management to export or backup your data.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-2">
                <h3 className="text-lg font-medium">Guides</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2 hover:underline cursor-pointer animate-fade-up">
                    <Info className="h-4 w-4 text-primary" /> Getting Started: Setup your business profile
                  </li>
                  <li className="flex items-center gap-2 hover:underline cursor-pointer animate-fade-up">
                    <Info className="h-4 w-4 text-primary" /> Inventory Best Practices
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-secondary" />
                <CardTitle>Contact Support</CardTitle>
              </div>
              <CardDescription>Send us a message and we'll get back within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-3" id="help-contact">
                <div>
                  <label className="text-sm">Name</label>
                  <Input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm">Message</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Short description of your issue" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>

              <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +91 98765 43210
                </div>
                <div className="mt-1">support@trademate.app</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Help;
