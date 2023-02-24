import React from "react";
import {
  useAddress,
  useMetamask,
  useLogin,
  useLogout,
  useUser,
  useDisconnect,
} from "@thirdweb-dev/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";

type TCollection = {
  collection: Collection;
};

const NftDropPage = ({ collection }: TCollection) => {
  const connect = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10">
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500 py-2 lg:py-0">
        <div className="flex flex-col items-center justify-center lg:h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl ">
            <img
              className="w-44 lg:w-72 lg:h-96 rounded-xl object-cover"
              src={urlFor(collection.previewImage).url()}
              alt="Apr eicture"
            />
          </div>
          <div className="text-center space-y-2 p-5">
            <h1 className="text-white text-4xl font-bold">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-gray-300 text-xl">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* this is left */}
      <div className="p-12 py-4 lg:col-span-6 flex flex-col flex-1">
        {/* Header */}
        <header className="flex justify-between items-center">
          <Link href="/">
            <h1 className="cursor-pointer w-52 text-xl font-extralight sm:w-60">
              The{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                ANONYMOUS
              </span>{" "}
              NFT Market Place
            </h1>
          </Link>
          <button
            onClick={() => (address ? disconnect() : connect())}
            className="bg-rose-400 px-4 py-2 rounded-full text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? "Sign out" : " Sign in"}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-sm text-rose-400">
            You are logged in with wallet {address.substring(0, 5)}....
            {address.substring(address.length - 5)}{" "}
          </p>
        )}
        {/* Content */}
        <div className="mt-5 flex flex-col flex-1 items-center lg:justify-center lg:space-y-0 space-y-6">
          <img
            alt="Rubbish"
            src={urlFor(collection.mainImage).url()}
            className="object-cover pb-10 lg:h-40 w-80"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold text-center">
            {collection.title}
          </h1>
          <p className="text-green-500 pt-2 text-xl">13 / 21 NFT's claimed</p>
        </div>
        {/* Mint */}
        <button className="h-16 bg-red-600 text-white rounded-full mt-10 font-bold">
          Mint NFT(0.01 ETH)
        </button>
      </div>
    </div>
  );
};

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type=="collection" && slug.current == $id][0]{
    _id,
      title,
      address,
      description,
      nftCollectionName,
      mainImage{
        asset
      },
      previewImage{
        asset
      },
    slug{
      current
    },
    creator ->{
      _id,
      name,
      address,
      slug{
        current
      }
    }
      
  }`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    }, // will be passed to the page component as props
  };
};
