import { getMetadataPointerState, getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";


const getMetaData = async (mint: PublicKey, connection: Connection) => {
  const mintInfo = await getMint(
    connection,
    mint,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  )

  // Retrieve and log the metadata pointer state
  const metadataPointer = getMetadataPointerState(mintInfo);


  // Retrieve and log the metadata state
  const metadata = await getTokenMetadata(
    connection,
    mint, // Mint Account address
  );

  // const AssociateTokenAddress = await getAssociatedTokenAddress(
  //   mint,
  //   publicKey,
  //   false,
  //   TOKEN_2022_PROGRAM_ID,
  // )

  // console.log("\nAssociate Token Address :", JSON.stringify(AssociateTokenAddress))

  return {
    metadataPointer: JSON.stringify(metadataPointer, null, 2),
    metadata: JSON.stringify(metadata, null, 2)
  }
}

export default getMetaData
