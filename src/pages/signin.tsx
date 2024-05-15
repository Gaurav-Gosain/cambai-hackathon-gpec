import Head from "next/head";
import { NextPage } from "next";
import Login from "@/components/login";
const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>SignIn page</title>
      </Head>
      <main>
        <Login />
      </main>
    </>
  );
};

export default SignIn;
