import Head from "next/head";
import Router from "next/router";

export default function Home() {
  return (
    <div>
      <Head>
        <title>
          Planning poker online | Basic version of planningpokeronline.com
        </title>
        <meta
          name="description"
          content="Planning poker online | Basic version of planningpokeronline.com"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex p-20 justify-center items-center h-screen bg-[#2d91fb]">
        <div className="w-1/2">
          <h1 className="font-bold text-6xl text-white">Scrum Poker for agile development teams</h1>
          <h4 className="my-4 text-lg text-white">
            Have fun while being productive with our simple and complete tool.
          </h4>

          <button
            onClick={() => Router.push("/zoom/new")}
            type="button"
            className="bg-white text-blue-500 px-6 py-2 rounded font-medium hover:bg-gray-200 transition duration-200 each-in-out"
          >
            Start New Zoom
          </button>
        </div>
        <div>
          <img src="bg.png" />
        </div>
      </main>
    </div>
  );
}
