import Head from "next/head";
import { NextPage } from "next";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { AuthModel } from "pocketbase";
import Webcam from "@/components/webcam";

const Home: NextPage = () => {
  // const user = pb.authStore.model;

  const router = useRouter();
  const signOut = () => {
    pb.authStore.clear();
    router.push("/signin");
  };

  const [user, setUser] = useState<AuthModel>(null);

  useEffect(() => {
    setUser(pb.authStore.model);
    console.log(pb.authStore.isValid, pb.authStore.model);
  }, [pb]);

  return (
    <>
      <Head>
        <title>Home page</title>
      </Head>
      <main>
        {!user ? (
          <Link href="/signin">Sign In page</Link>
        ) : (
          <>
            <h1>{user.name}</h1>
            <p>
              <img
                src={user.avatarUrl}
                referrerPolicy="no-referrer"
                width={50}
                alt="avatar"
              />
            </p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={signOut}>Sign Out</button>
            <Webcam user={user} />
          </>
        )}
      </main>
    </>
  );
};

export default Home;
