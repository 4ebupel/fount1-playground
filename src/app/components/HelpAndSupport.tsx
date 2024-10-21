"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import GenericAccordion from './GenericAccordion'

const faqItems = [
  {
    trigger: "How do I reset my password?",
    content: "To reset your password, click on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password.",
  },
  {
    trigger: "How can I update my profile information?",
    content: "Log in to your account and navigate to the Profile Settings page. There you can update your personal details, profile picture, and privacy preferences.",
  },
  {
    trigger: "What should I do if I can't log in?",
    content: "If you're having trouble logging in, first ensure you're using the correct email and password. If you still can't log in, try resetting your password. If issues persist, please contact our support team.",
  },
  {
    trigger: "How do I cancel my subscription?",
    content: "To cancel your subscription, go to your Account Settings and select the 'Subscription' tab. Click on 'Cancel Subscription' and follow the prompts. Please note that you'll continue to have access until the end of your current billing period.",
  },
]

export default function HelpAndSupport() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topic, setTopic] = useState("")

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-8">Help and Support</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 lg:p-8">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <GenericAccordion items={faqItems} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 lg:p-8">
          <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email address" />
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Select onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="billing">Billing Inquiries</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Describe your issue or question" className="h-32" />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  )
}