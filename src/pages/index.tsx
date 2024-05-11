import Image from "next/image";
import { Inter } from "next/font/google";
import Webcam from "../components/webcam";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Webcam />
  );
}
