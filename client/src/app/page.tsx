

import VideoContainer from "@/components/VideoContainer";


import AppShell from "@/layout/AppShell";

export default function Home() {


  return (
    <AppShell>
      <section className="p-6">
        <VideoContainer
          className="        
              grid 
              grid-cols-[repeat(auto-fit,minmax(300px,1fr))] 
              gap-5
              thin-scrollbar
              "
        />
      </section>
    </AppShell>
  );
}
