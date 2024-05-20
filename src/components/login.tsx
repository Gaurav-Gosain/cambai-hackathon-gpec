import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggle";
import LoginImage from "@/public/login.svg";
import CambLogo from "@/public/camb.svg";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";

export default function Login() {
  const router = useRouter();

  const storeUserAndRedirect = () => {
    router.push("/");
  };

  const signIn = async (e: any, w: any) => {
    e.preventDefault();

    pb.collection("users")
      .authWithOAuth2({
        provider: "google",
        urlCallback: (url) => {
          w.location.href = url as any;
        },
      })
      .then(async (response) => {
        const user = await pb.collection("users").getOne(response.record.id);
        if (
          user.name &&
          user.avatarUrl &&
          user.name === response.meta?.name &&
          user.avatarUrl === response.meta?.avatarUrl
        ) {
          storeUserAndRedirect();
        } else
          pb.collection("users")
            .update(response.record.id, {
              name: response.meta?.name,
              avatarUrl: response.meta?.avatarUrl,
            })
            .then(() => {
              storeUserAndRedirect();
            })
            .catch((err) => {
              console.error(err);
            });
      });
  };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted h-full lg:flex items-center justify-center">
        <Image
          src={CambLogo}
          alt="Login Image"
          className="h-auto w-3/4 m-auto"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center"></div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2 py-8"
              onClick={(e) => signIn(e, window.open())}
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-lg">Login with Google</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
