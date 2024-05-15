import Head from "next/head";
import { NextPage } from "next";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/router";
const SignIn: NextPage = () => {
  const router = useRouter();

  const storeUserAndRedirect = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>SignIn page</title>
      </Head>
      <main>
        <div>
          <button
            onClick={async () => {
              pb.collection("users")
                .authWithOAuth2({
                  provider: "google",
                })
                .then(async (response) => {
                  console.log(response);
                  const user = await pb
                    .collection("users")
                    .getOne(response.record.id);
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
            }}
          >
            Sign in with Google
          </button>
        </div>
      </main>
    </>
  );
};

export default SignIn;
