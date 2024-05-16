import Head from "next/head";
import { NextPage } from "next";
import Login from "@/components/login";
const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign In page (CAMB.AI x GPEC)</title>
      </Head>
      <main>
        <Login />
      </main>
    </>
  );
};

export default SignIn;
