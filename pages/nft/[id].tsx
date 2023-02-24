import React, { useEffect, useState } from "react";
import {
  useAddress,
  useMetamask,
  useLogin,
  useLogout,
  useUser,
  useDisconnect,
  useNFT,
  useNFTDrop,
  useContract,
} from "@thirdweb-dev/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";
import toast, { Toaster } from "react-hot-toast";

type TCollection = {
  collection: Collection;
};

const NftDropPage = ({ collection }: TCollection) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const nftDrop = useNFTDrop(collection.address);
  // const nftDrop = useContract(collection.address, "nft-drop");
  const [loading, setLoading] = useState<boolean>();
  const [priceInEth, setPriceInEth] = useState<string>();

  const connect = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (!nftDrop) return;
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
    };
    fetchPrice();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;
    const fetchNFTDrop = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      setClaimedSupply(claimed.length);
      setTotalSupply(total);
      setLoading(false);
    };
    fetchNFTDrop();
  }, [nftDrop]);

  const mintNft = () => {
    if (!nftDrop || !address) return;
    const quantity = 1;
    setLoading(true);
    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNft = await tx[0].data();
        toast("HOORAY, You successfully Minted", {
          duration: 8000,
          style: {
            background: "green",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
        //console
        // console.log(receipt);
        // console.log(claimedTokenId);
        // console.log(claimedNft);
      })
      .catch((err) => {
        console.log(err);
        toast("Whoops, Something went Wrong", {
          duration: 8000,
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
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
          {loading ? (
            <p className="text-green-500 pt-2 text-xl">
              Loading Supply Count......
            </p>
          ) : (
            <p className="text-green-500 pt-2 text-xl">
              {claimedSupply} / {totalSupply?.toString()} NFT's claimed
            </p>
          )}
          {/* {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon/images/0x4Gzjgh9Y7Gu8KEtZ.gif"
              alt="Loading....."
            />
          )} */}
        </div>
        {/* Mint */}

        <button
          onClick={() => mintNft()}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          // disabled={false}
          className="h-16 bg-red-600 text-white rounded-full mt-10 font-bold disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading....</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold"> Mint NFT({priceInEth} ETH)</span>
          )}
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
