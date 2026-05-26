"use client";

import { updateLikesApi } from "@/api/videoApi";
import {  ReactNode } from "react";

type Props = {
  children: ReactNode;
  id: string;
};

const Button = ({ children, id }: Props) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition border-r border-white/10"
      onClick={async () => {
        await updateLikesApi(id);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
