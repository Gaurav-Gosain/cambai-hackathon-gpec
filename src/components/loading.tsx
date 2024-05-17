import { cn } from "@/lib/utils";

const Loading = ({ status }: { status?: string }) => {
  return (
    <div
      className={cn(
        `w-screen fixed top-14 left-0 h-[calc(100vh-56px)] flex items-center justify-center  bg-background/90 z-[99]`,
        status && "-mt-12",
      )}
    >
      {status && (
        <div className="absolute mt-24 text-3xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          <h1>{status}</h1>
        </div>
      )}
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
