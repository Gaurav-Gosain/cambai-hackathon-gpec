import Head from "next/head";
import { NextPage } from "next";
import Webcam from "@/components/webcam";
import { useAuthStore } from "@/lib/stores/user-store";
import Loading from "@/components/loading";

const Home: NextPage = () => {
  const { user } = useAuthStore();

  if (user === null) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>CAMB.AI x GPEC</title>
      </Head>

      <Webcam demo={false} user={user} />
    </>
  );
};

export default Home;
