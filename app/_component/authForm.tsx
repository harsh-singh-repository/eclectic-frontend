"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(3).max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Fix for error #1:
// Use z.preprocess so the inferred INPUT type stays `string` (what the HTML input
// gives us), while the OUTPUT type becomes `number` after coercion.
// Then use z.input<typeof registerSchema> for useForm's generic — this matches
// the raw field values RHF manages, fixing SubmitHandler mismatch (error #2).
const registerSchema = z
  .object({
    name: z.string().min(3, "At least 3 characters").max(50),
    email: z.string().email("Invalid email address").min(3).max(50),
    garde: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
     z.number().min(1, "Grade must be ≥ 1").max(100, "Grade must be ≤ 100")
    ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    city: z.string().min(3, "At least 3 characters").max(50),
    mobileNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number (must start with 6–9)"),
    parentsMobileNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number (must start with 6–9)"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginFormValues = z.infer<typeof loginSchema>;
// z.input gives the RAW shape (before preprocess transforms),
// which is what react-hook-form's field values actually hold.
type RegisterFormValues = z.input<typeof registerSchema>;
type AuthMode = "login" | "register";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Primitive Components ─────────────────────────────────────────────────────

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}
function Label({ htmlFor, children, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-xs font-medium text-slate-500 mb-1", className)}
    >
      {children}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800",
        "placeholder:text-slate-300 bg-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400",
        "transition-all duration-150",
        className
      )}
      {...props}
    />
  );
}

interface ErrorMsgProps {
  message?: string;
}
function ErrorMsg({ message }: ErrorMsgProps) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 4.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5zm-.75 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
      </svg>
      {message}
    </p>
  );
}

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}
function Field({ label, id, error, children }: FieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      <ErrorMsg message={error} />
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

interface SuccessProps {
  title: string;
  message: string;
  action: { label: string; onClick: () => void };
}
function SuccessScreen({ title, message, action }: SuccessProps) {
  return (
    <div className="text-center py-10 space-y-3">
      <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
        <svg
          className="w-6 h-6 text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.707-4.707a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-400">{message}</p>
      <button
        onClick={action.onClick}
        className="text-xs text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors"
      >
        {action.label}
      </button>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSwitch: () => void;
}
function LoginForm({ onSwitch }: LoginFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    await new Promise<void>((r) => setTimeout(r, 900));

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Signed in successfully");

      // Get updated session
      const session = await getSession();

      const role = session?.user?.user?.role;

      // Push according to role
      switch (role) {
        case "ADMIN":
          router.push("/admin");
          break;

        case "STUDENT":
          router.push("/dashboard");
          break;

        default:
          router.push("/");
      }
    } else if (res?.error) {
      toast.error(res.error);
    } else {
      toast.error("Invalid credentials");
    }
  };

  if (submitted)
    return (
      <SuccessScreen
        title="Signed in successfully"
        message="Welcome back to Academia."
        action={{ label: "Sign in again", onClick: () => setSubmitted(false) }}
      />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Email address" id="l-email" error={errors.email?.message}>
        <Input
          id="l-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <Field label="Password" id="l-password" error={errors.password?.message}>
        <Input
          id="l-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
      </Field>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
          <input type="checkbox" className="accent-blue-500" />
          Remember me
        </label>
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          Register
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

interface RegisterFormProps {
  onSwitch: () => void;
}
function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues): Promise<void> => {
    await new Promise<void>((r) => setTimeout(r, 1100));
    console.log("Register payload:", data);
    setSubmitted(true);
  };

  if (submitted)
    return (
      <SuccessScreen
        title="Account created!"
        message="Your registration was successful."
        action={{ label: "Go to sign in →", onClick: onSwitch }}
      />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Row 1 — Name + Grade */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" id="r-name" error={errors.name?.message}>
          <Input
            id="r-name"
            placeholder="Riya Sharma"
            autoComplete="name"
            {...register("name")}
          />
        </Field>

        <Field
          label="Grade"
          id="r-grade"
          error={errors.garde?.message as string | undefined}
        >
          <Input
            id="r-grade"
            type="number"
            placeholder="10"
            min={1}
            max={100}
            {...register("garde")}
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email address" id="r-email" error={errors.email?.message}>
        <Input
          id="r-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      {/* City */}

      {/* Row 2 — Phone numbers */}
      <div className="grid grid-cols-2 gap-3">


        <Field
          label="Mobile number"
          id="r-mobile"
          error={errors.mobileNumber?.message}
        >
          <Input
            id="r-mobile"
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            autoComplete="tel"
            {...register("mobileNumber")}
          />
        </Field>
        <Field label="City" id="r-city" error={errors.city?.message}>
          <Input
            id="r-city"
            placeholder="Mumbai"
            autoComplete="address-level2"
            {...register("city")}
          />
        </Field>

        {/* <Field
          label="Parent's mobile"
          id="r-parent"
          error={errors.parentsMobileNumber?.message}
        >
          <Input
            id="r-parent"
            type="tel"
            placeholder="9876543210"
            maxLength={10}
            {...register("parentsMobileNumber")}
          />
        </Field> */}
      </div>

      {/* Row 3 — Passwords */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Password" id="r-pass" error={errors.password?.message}>
          <Input
            id="r-pass"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>

        <Field
          label="Confirm password"
          id="r-confirm"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="r-confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");
  const isLogin = mode === "login";

  const tabs: { key: AuthMode; label: string }[] = [
    { key: "login", label: "Sign In" },
    { key: "register", label: "Register" },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-100">
        {/* Wordmark */}
        {/* <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-slate-700 text-lg">Academia</span>
        </div> */}

        {/* Card */}
        <div className="overflow-hidden">
          {/* Card header */}
          <div className="px-7 pt-7 pb-5 border-b border-slate-100">
            <h1 className="text-xl font-semibold text-slate-800">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {isLogin
                ? "Sign in to your Academia account."
                : "Fill in the details below to get started."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all duration-150",
                  mode === key
                    ? "text-blue-500 border-b-2 border-blue-500 bg-white"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-3 py-6">
            {isLogin ? (
              <LoginForm onSwitch={() => setMode("register")} />
            ) : (
              <RegisterForm onSwitch={() => setMode("login")} />
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-slate-600 transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-slate-600 transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}