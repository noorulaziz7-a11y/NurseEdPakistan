// src/pages/contact.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Thank you! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
          Contact & Feedback
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-muted-foreground">support@nursingeducatorhub.com</p>
            </Card>

            <Card className="p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Phone</h3>
              </div>
              <p className="text-muted-foreground">+92 300 1234567</p>
            </Card>

            <Card className="p-6 border-l-4 border-indigo-500">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              <p className="text-muted-foreground">
                Nursing Educator Hub, Karachi, Pakistan
              </p>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    placeholder="Your message or feedback..."
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-4">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
