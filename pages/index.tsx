import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import ModalForJoinToRoom from "../components/ModalForJoinToRoom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {isModalOpen && <ModalForJoinToRoom setIsModalOpen={setIsModalOpen} />}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="text-center">
          <p className="text-lg my-2">Hey Sir, </p>

          <h1 className="text-3xl font-bold">
            Welcome to the Socket.io Message App
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <button
              disabled
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 p-4 block rounded-full text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Start Conversation
            </button>
            <Link
              href="/messages"
              className="bg-blue-500 p-4 block text-white rounded-full"
            >
              <span>Go to Chatting Room</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
