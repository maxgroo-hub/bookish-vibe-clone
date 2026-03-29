import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Library, Mail, Lock, Eye, EyeOff, User, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store";
import { toast } from "@/components/ui/sonner";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";

const schema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["member", "admin"]),
  adminCode: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "member" },
  });
  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.fullName, data.role, data.adminCode);
      toast.success("Account created! Please check your email to confirm your account.");
      navigate("/signin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed";
      toast.error(message);
    }
  };

  const handleGuestLogin = (role: "member" | "admin") => {
    loginAsGuest(role);
    toast.success(`Logged in as Guest ${role === "admin" ? "Admin" : "User"}`);
    navigate(role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Library className="w-8 h-8" />
          <span className="font-heading text-2xl font-bold">LibraVault</span>
        </Link>

        <div className="brutal-card p-8 rounded-lg">
          <h1 className="font-heading text-3xl font-black mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">Join the LibraVault community</p>

          <button
            onClick={handleGoogle}
            className="brutal-btn w-full bg-background rounded-md mb-6 flex items-center justify-center gap-3 font-heading"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-0.5 bg-foreground/20" />
            <span className="text-sm text-muted-foreground font-semibold">OR</span>
            <div className="flex-1 h-0.5 bg-foreground/20" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-heading font-bold text-sm mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...register("fullName")} placeholder="John Doe" className="brutal-input w-full pl-11 rounded-md" />
              </div>
              {errors.fullName && <p className="text-destructive text-sm mt-1 font-semibold">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="font-heading font-bold text-sm mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...register("email")} type="email" placeholder="you@example.com" className="brutal-input w-full pl-11 rounded-md" />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-heading font-bold text-sm mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••" className="brutal-input w-full pl-11 pr-11 rounded-md" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1 font-semibold">{errors.password.message}</p>}
            </div>

            <div>
              <label className="font-heading font-bold text-sm mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...register("confirmPassword")} type="password" placeholder="••••••••" className="brutal-input w-full pl-11 rounded-md" />
              </div>
              {errors.confirmPassword && <p className="text-destructive text-sm mt-1 font-semibold">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="font-heading font-bold text-sm mb-2 block">I am a...</label>
              <div className="flex gap-3">
                <label className={`flex-1 brutal-btn rounded-md text-center cursor-pointer text-sm ${role === "member" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                  <input {...register("role")} type="radio" value="member" className="sr-only" />
                  <User className="w-4 h-4 inline mr-1" /> Member
                </label>
                <label className={`flex-1 brutal-btn rounded-md text-center cursor-pointer text-sm ${role === "admin" ? "bg-secondary text-secondary-foreground" : "bg-background"}`}>
                  <input {...register("role")} type="radio" value="admin" className="sr-only" />
                  <ShieldCheck className="w-4 h-4 inline mr-1" /> Admin
                </label>
              </div>
            </div>

            {role === "admin" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
                <label className="font-heading font-bold text-sm mb-1 block">Admin Secret Code</label>
                <input {...register("adminCode")} type="password" placeholder="Enter admin code" className="brutal-input w-full rounded-md" />
                <p className="text-xs text-muted-foreground mt-1">Contact your system administrator for the admin code.</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn w-full bg-primary text-primary-foreground rounded-md font-heading text-lg disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="font-bold text-accent hover:underline">Sign In</Link>
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-0.5 bg-foreground/20" />
            <span className="text-sm text-muted-foreground font-semibold">GUEST LOGIN</span>
            <div className="flex-1 h-0.5 bg-foreground/20" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => handleGuestLogin("member")}
              className="brutal-btn bg-accent text-accent-foreground rounded-md text-sm font-heading flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> Guest User
            </button>
            <button
              onClick={() => handleGuestLogin("admin")}
              className="brutal-btn bg-secondary text-secondary-foreground rounded-md text-sm font-heading flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Guest Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
