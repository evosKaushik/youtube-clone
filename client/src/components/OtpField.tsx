"use client";

import { useEffect, useState } from "react";

type OTPState = "idle" | "error" | "success";

function CheckIcon({
  size = 16,
  strokeWidth = 3,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function OTPSuccess() {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <div
        className="
          w-16
          h-16
          rounded-full
          bg-green-500
          text-white
          flex
          items-center
          justify-center
          ring-4
          ring-green-100
          transition-all
          duration-300
        "
      >
        <CheckIcon size={32} />
      </div>

      <p className="text-lg font-semibold text-green-600">
        OTP Verified!
      </p>
    </div>
  );
}

function OTPError() {
  return (
    <div className="absolute -bottom-8 text-red-500 text-sm font-medium">
      Invalid OTP. Please try again.
    </div>
  );
}

type OTPInputBoxProps = {
  index: number;
  state: OTPState;
  verifyOTP: () => void;
};

function OTPInputBox({
  index,
  state,
  verifyOTP,
}: OTPInputBoxProps) {
  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value;

    if (!/^[0-9]?$/.test(value)) {
      input.value = "";
      return;
    }

    if (value && index < 3) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }

    verifyOTP();
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const value = e.currentTarget.value;

    if (e.key === "Backspace" && !value && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowRight" && index < 3) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }
  };

  return (
    <div
      className={`
        w-14
        h-16
        border-2
        rounded-xl
        overflow-hidden
        transition-all
        duration-300
        ${
          state === "error"
            ? "border-red-500"
            : state === "success"
            ? "border-green-500"
            : "border-gray-300 focus-within:border-gray-500"
        }
      `}
    >
      <input
        id={`input-${index}`}
        type="text"
        maxLength={1}
        inputMode="numeric"
        disabled={state === "success"}
        onInput={onInput}
        onKeyDown={onKeyDown}
        className="
          w-full
          h-full
          text-center
          text-3xl
          font-semibold
          outline-none
          bg-transparent
        "
      />
    </div>
  );
}

export default function OTPVerification() {
  const [state, setState] = useState<OTPState>("idle");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] =
    useState(true);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const getCode = () => {
    let code = "";

    for (let i = 0; i < 4; i++) {
      const input = document.getElementById(
        `input-${i}`
      ) as HTMLInputElement | null;

      if (input) {
        code += input.value;
      }
    }

    return code;
  };

  const errorAnimation = () => {
    setState("error");

    setShake(true);

    setTimeout(() => {
      setShake(false);
    }, 300);

    setTimeout(() => {
      setState("idle");
    }, 500);
  };

  const verifyOTP = () => {
    const code = getCode();

    if (code.length < 4) {
      setState("idle");
      return;
    }

    if (code === "1234") {
      setState("success");
    } else {
      errorAnimation();
    }
  };

  const handleResend = () => {
    console.log("Resending OTP...");

    setCountdown(60);
    setIsResendDisabled(true);
  };

  return (
    <div
      className="rounded-3xl p-8 w-full max-w-sm shadow-lg relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://media.giphy.com/media/3owypkjxtrXUvhJiCY/giphy.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/90 rounded-3xl" />

      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          {state === "success"
            ? "Verification Successful!"
            : "Enter Verification Code"}
        </h1>

        {state === "success" ? (
          <div
            className="
              h-[232px]
              flex
              items-center
              justify-center
              transition-all
              duration-300
            "
          >
            <OTPSuccess />
          </div>
        ) : (
          <div className="transition-all duration-300">
            <p className="text-center text-gray-600 mt-2 mb-8">
              We've sent a 4-digit code to
              <br />
              <span className="font-medium text-gray-800">
                yourname@example.com
              </span>
            </p>

            <div className="flex flex-col items-center gap-2 mb-10 relative h-20">
              <div
                className={`
                  flex
                  gap-4
                  ${shake ? "animate-shake" : ""}
                `}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <OTPInputBox
                    key={index}
                    index={index}
                    state={state}
                    verifyOTP={verifyOTP}
                  />
                ))}
              </div>

              {state === "error" && <OTPError />}
            </div>

            <div className="text-center">
              <span className="text-gray-600">
                Didn't get a code?{" "}
              </span>

              {isResendDisabled ? (
                <span className="text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  className="
                    font-medium
                    hover:underline
                  "
                >
                  Click to resend
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

