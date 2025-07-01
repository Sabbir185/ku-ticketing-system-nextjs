import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { User } from "@/types/tickets";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth/login";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login } = useAuth() as { login: (user: User) => void };
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const response = await loginAction(formData);
      console.log("🚀 ~ onSubmit ~ response:", response)
      if (response?.success === false) {
        toast.error(response?.message || "Login failed. Please try again.", {
          style: {
            background: "#FF8282",
            color: "white",
            border: "0px solid #FF8282",
          },
        });
      } else {
        login(response?.data as User);
        if (response?.data?.role === "ADMIN") {
          toast.success("Login successful! Redirecting...");
          router.push("/admin");
        } else if(response?.data?.role === "EMPLOYEE") {
          toast.success("Login successful! Redirecting...");
          router.push("/employee");
        } else if(response?.data?.role === "USER") {
          toast.success("Login successful! Redirecting...");
          router.push("/user");
        } else {
          toast.error("You are not authorized to access this page", {
             style: {
            background: "#FF8282",
            color: "white",
            border: "0px solid #FF8282",
          },
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: "user" | "employee" | "admin") => {
    setValue("email", `${role}@gmail.com`);
    setValue("password", "123456");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md border-none" >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Support Ticket System
          </CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="space-y-2 ">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                autoComplete="username"
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                autoComplete="current-password"
                required
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button disabled={loading} type="submit" className="w-full cursor-pointer">
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex justify-end text-sm">
              <Link href={"/signup"}>Create a new account</Link>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Demo Login
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("user")}
            >
              User
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("employee")}
            >
              Employee
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("admin")}
            >
              Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;