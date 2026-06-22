"use client";

import { useEffect, useRef, useState } from "react";
import { indianStates } from "@/constant/constant";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import { getStateFromLocation } from "@/libs/utils";
import toast from "react-hot-toast";
import { usePopup } from "@/contexts/popupContext";
import { useUser } from "@/libs/AuthContext";
import Link from "next/link";
import { registerApi, verifyOtpApi } from "@/api/userApi";
import { useRouter } from 'next/navigation';

import GuestGuard from "@/components/common/GuestGuard";

const LoginCardSection = () => {
  const router = useRouter();
  const { loginWithGoogle } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    state: "",
  });

  const [serverError, setServerError] = useState("");
  const { showPopup } = usePopup();

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      username: "",
      email: "",
      password: "",
      state: "",
    };

    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
      isValid = false;
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (!state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Only letters, numbers and underscores allowed";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setServerError("");

    const isValid = validateForm();

    if (!isValid) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formData = {
        name: fullName,
        username,
        email,
        password,
        userState: state,
      };

      const data = await registerApi(formData);
      console.log(data);
      console.log("SUCCESS", formData);
      if (!data?.success && !data?.message) return;

      // if(data?.success)
      toast.success(
        data?.message || "Registered successfully! Please login to continue.",
      );

      const verifyOTP = async () => {
        const otpInput = document.getElementById(
          "otp-input",
        ) as HTMLInputElement;

        const otp = otpInput?.value;

        if (!otp || otp.length !== 4) {
          toast.error("Please enter a valid 4 digit OTP.");
          return;
        }

        try {
          // Call your API to verify the OTP here
          const data = await verifyOtpApi({ email, otp });

          if (data?.success) {
            toast.success("OTP verified successfully!");
            router.push('/signup'); // Redirect to login page after successful OTP verification}
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to verify OTP. Please try again.");
        }
      };
      showPopup({
        header: "Enter OTP",

        body: (
          <div className="space-y-4">
            <p>We have sent a 4 digit OTP to {email}</p>

            <input
              type="text"
              maxLength={4}
              id="otp-input"
              className="

          w-full
          h-12
          rounded-lg
          border
          border-gray-700
          bg-black
          px-4
        "
            />
          </div>
        ),

        button2: {
          label: "Verify",
          action: verifyOTP,
        },
      });
    } catch (error) {
      console.error(error);

      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const existingUserState = localStorage.getItem("user_state");

      if (existingUserState) {
        await loginWithGoogle(existingUserState);
        return;
      }

      showPopup({
        header: "Location Access Required",
        popupMsg:
          "We use your location to improve your experience. Do you want to continue?",

        selfClose: true,

        button1: {
          label: "Cancel",
          action: () => {},
        },

        button2: {
          label: "Allow",
          action: async () => {
            try {
              const state = await getStateFromLocation();

              localStorage.setItem("user_state", state);

              showPopup({
                header: "Location Found",
                popupMsg: `Your state is ${state}`,
                selfClose: true,

                button2: {
                  label: "Continue",
                  action: () => loginWithGoogle(state),
                },
              });
            } catch (error) {
              showPopup({
                header: "Location Error",
                popupMsg:
                  error instanceof Error
                    ? error.message
                    : "Something went wrong",

                selfClose: true,

                button2: {
                  label: "Continue Without Location",
                  action: () => loginWithGoogle("Unknown"),
                },
              });
            }
          },
        },
      });
    } catch (error) {
      console.error(error);

      loginWithGoogle("Unknown");
    }
  };

  const handleForgotPassword = () => {
    console.log("🔑 Forgot Password");
  };

  const handleCreateAccount = () => {
    console.log("📝 Create Account");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();

    type Particle = {
      x: number;
      y: number;
      v: number;
      o: number;
    };

    let particles: Particle[] = [];
    let raf = 0;

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      particles = [];

      const count = Math.floor((canvas.width * canvas.height) / 9000);

      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.v;

        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 20;
        }

        ctx.fillStyle = `rgba(255,255,255,${p.o})`;

        ctx.fillRect(p.x, p.y, 1, 2);
      });

      raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", handleResize);

    init();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);

      cancelAnimationFrame(raf);
    };
  }, []);

  const handleAutoSelectStateClick = async () => {
    const state = await getStateFromLocation();

    setState(state);
  };

  return (
    <GuestGuard>
    <section
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "var(--background)",
        color: "var(--text)",
      }}
    >
      <style>{`
        .card-animate {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glass-card {
          background: color-mix(in srgb, var(--card) 85%, transparent);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>

      {/* Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,255,255,.08), transparent 60%)",
        }}
      />

      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>
      <canvas
        ref={canvasRef}
        className="
    absolute
    inset-0
    w-full
    h-full
    opacity-50
    pointer-events-none
  "
      />
      {/* Card */}
      <form
        onSubmit={handleSubmit}          className="
    card-animate
          glass-card
          w-full
          max-w-[520px]
          rounded-[28px]
          px-4 sm:px-8 py-8
          border
          shadow-2xl
        "
        style={{
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Create your account
          </h1>

          <p
            className="mt-2 text-sm sm:text-base"
            style={{
              color: "var(--secondary-text)",
            }}
          >
            Create your account and get started
          </p>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            Enter your Full Name
          </label>

          <div className="relative">
            <FaEnvelope
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color="gray"
            />

            <input
              type="text"
              disabled={loading}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);

                if (errors.fullName) {
                  setErrors((prev) => ({
                    ...prev,
                    fullName: "",
                  }));
                }
              }}
              placeholder="John"
              className="
    w-full
    h-12
    pl-12
    pr-4
    rounded-xl
    border
    outline-none
    transition-all
  "
              style={{
                background: "var(--background)",
                borderColor: errors.fullName ? "#ef4444" : "var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        {/* Username */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            Enter your Username
          </label>

          <div className="relative">
            <FaEnvelope
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color="gray"
            />

            <input
              type="text"
              disabled={loading}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);

                if (errors.username) {
                  setErrors((prev) => ({
                    ...prev,
                    username: "",
                  }));
                }
              }}
              placeholder="John"
              className="
    w-full
    h-12
    pl-12
    pr-4
    rounded-xl
    border
    outline-none
    transition-all
  "
              style={{
                background: "var(--background)",
                borderColor: errors.username ? "#ef4444" : "var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Enter your Email
          </label>

          <div className="relative">
            <FaEnvelope
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color="gray"
            />

            <input
              type="email"
              disabled={loading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
              placeholder="you@example.com"
              className="
    w-full
    h-12
    pl-12
    pr-4
    rounded-xl
    border
    outline-none
    transition-all
  "
              style={{
                background: "var(--background)",
                borderColor: errors.email ? "#ef4444" : "var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Password</label>

          <div className="relative">
            <FaLock
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color="gray"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
              placeholder="••••••••"
              className="
    w-full
    h-12
    pl-12
    pr-12
    rounded-xl
    border
    outline-none
    transition-all
  "
              style={{
                background: "var(--background)",
                borderColor: errors.password ? "#ef4444" : "var(--border)",
                color: "var(--text)",
              }}
            />

            <button
              type="button"
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-secondaryText
              "
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        {/*Select State*/}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 w-full">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-12 rounded-xl border px-4 bg-card w-full sm:w-[70%]"
            style={{
              borderColor: errors.state ? "#ef4444" : "var(--border)",
            }}
          >
            <option value="">Select State</option>

            {indianStates.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
          <button
            className={`
              w-full sm:w-[30%]
              h-12
              rounded-xl
              font-semibold
              transition-all
              duration-300
              
            `}
            onClick={handleAutoSelectStateClick}
            style={{
              background: "var(--text)",
              color: "var(--background)",
            }}
          >
            Auto Select
          </button>
        </div>
        {errors.state && (
          <p className="mt-1 text-sm text-red-500">{errors.state}</p>
        )}

        <div className="flex items-center justify-end mb-6">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm hover:underline"
            style={{
              color: "var(--secondary-text)",
            }}
          >
            Forgot password?
          </button>
        </div>
        {serverError && (
          <div
            className="
              mb-4
              rounded-xl
              border
              border-red-500
              bg-red-500/10
              p-3
              text-sm
              text-red-500
            "
          >
            {serverError}
          </div>
        )}

        {/* Continue */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full
            h-12
            rounded-xl
            font-semibold
            transition-all
            duration-300
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"}
          `}
          style={{
            background: "var(--text)",
            color: "var(--background)",
          }}
        >
          {loading ? "Signing In..." : "Continue"}
        </button>

        {/* Divider */}
        <div className="relative my-7">
          <div
            className="h-px"
            style={{
              background: "var(--border)",
            }}
          />

          <span
            className="absolute left-1/2 -translate-x-1/2 -top-3 px-3 text-xs uppercase"
            style={{
              background: "var(--card)",
              color: "var(--secondary-text)",
            }}
          >
            OR
          </span>
        </div>

        {/* Social Login */}
        <div className="flex w-full sm:w-[90%] mx-auto ">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
              h-12
              rounded-xl
              border
              flex
              items-center
              justify-center
              gap-2
              transition-all
              duration-300
              hover:scale-[1.02]
              grow
            "
            style={{
              borderColor: "var(--border)",
            }}
          >
            <FaGoogle />
            Google
          </button>
        </div>

        {/* Footer */}
        <div
          className="mt-8 text-center text-sm"
          style={{
            color: "var(--secondary-text)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/signup"
            className="font-medium hover:underline"
            style={{
              color: "var(--text)",
            }}
          >
            Sign up
          </Link>
        </div>
      </form>
    </section>
    </GuestGuard>
  );
};

export default LoginCardSection;
