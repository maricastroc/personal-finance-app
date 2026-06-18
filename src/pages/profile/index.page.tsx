import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return null;
}
