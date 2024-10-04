"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Attempting to sign in");
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Sign in response: ", res);

      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else if (res?.ok) {
        router.push("/candidate");
      } else {
        setError("An unexpected error occurred"); // <-- error fires either here
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login error: ", err);
      setError("An unexpected error occurred"); // <-- or here
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
        <CardDescription>Access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}