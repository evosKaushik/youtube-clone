"use client";

import { useUser } from "@/libs/AuthContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import { usePopup } from "@/contexts/popupContext";
import { getStateFromLocation } from "@/libs/utils";
import { loginApi } from "@/api/userApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginCardSection = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const { showPopup } = usePopup();
  const { loginWithGoogle } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginApi({
        email,
        password,
      });
      if (data?.success) {
        toast.success("Login Success");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_state", JSON.stringify(data?.user?.userState));

        setTimeout(() => {
          setUser(data?.user);
          router.push("/"); // Redirect to home page after successful login
        }, 2000);
      }
    } catch (error) {
      toast.error("Login Failed");
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
      toast.error("An error occurred while logging in");

      loginWithGoogle("Unknown");
    }
  };

  const handleForgotPassword = () => {
    toast("🔑 Forgot Password");
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

  return (
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
          py-4
          px-4 sm:px-8
          border
          shadow-2xl
        "
        style={{
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Welcome back</h1>

          <p
            className="mt-2 text-sm sm:text-base"
            style={{
              color: "var(--secondary-text)",
            }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">Email</label>

          <div className="relative">
            <FaEnvelope
              className="absolute left-4 top-1/2 -translate-y-1/2"
              color="gray"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
          </div>
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
              onChange={(e) => setPassword(e.target.value)}
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
                borderColor: "var(--border)",
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
        </div>

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

        {/* Continue */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-12
            rounded-xl
            font-semibold
            transition-all
            duration-300
            hover:scale-[1.02]
            active:scale-[0.98]
          "
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
          Don't have an account?{" "}
          <Link
            href="/signin"
            className="font-medium hover:underline"
            style={{
              color: "var(--text)",
            }}
          >
            Create one
          </Link>
        </div>
      </form>
    </section>
  );
};

export default LoginCardSection;
