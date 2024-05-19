import Loading from "@/components/loading";
import pb from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DubbingRoute() {
  const router = useRouter();

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!router.query.id) return;
    pb.collection("dubbing")
      .getOne(router.query.id as string)
      .then((val) => setStatus(val.status));
    pb.collection("dubbing").unsubscribe();
    pb.collection("dubbing").subscribe(router.query?.id as string, (data) => {
      if (data.action === "update") {
        setStatus(data.record.status);
      }
    });
  }, [router, setStatus]);

  return (
    <div
      className={cn(
        `w-screen h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center`,
      )}
    >
      <div className="loader !m-0 !my-16"></div>
      {status && (
        <div className="md:text-3xl font-bold flex flex-col items-center justify-center gap-2 mx-16">
          <h3 className="text-sm text-muted-foreground">Dubbing Status</h3>
          <h1>{status}</h1>
          <h4 className="text-xs text-muted-foreground ">
            The above status will automatically update...
          </h4>
        </div>
      )}
    </div>
  );
}
