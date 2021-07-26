import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import * as fakesdk from "./fakesdk";
import { setConfig, core } from "@dsnp/sdk";
import { Publication } from "@dsnp/sdk/core/contracts/publisher";
import { providers } from "ethers";
import { keccak256 } from "web3-utils";
import { addFeedItem, clearFeedItems } from "../redux/slices/feedSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Store } from "./Storage";
import { ActivityPub } from "@dsnp/sdk/core/activityPub";
import {
  BroadcastAnnouncement,
  AnnouncementType,
  SignedBroadcastAnnouncement,
  SignedReplyAnnouncement,
  ReplyAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationCallbackArgs } from "@dsnp/sdk/core/contracts/subscription";

interface BatchFileData {
  url: URL;
  hash: HexString;
}

type Dispatch = ThunkDispatch<any, Record<string, any>, AnyAction>;

export const getSocialIdentity = async (
  walletAddress: HexString
): Promise<HexString> => {
  let socialAddress: HexString = await fakesdk.getSocialIdentityfromWalletAddress(
    walletAddress
  );
  if (!socialAddress) {
    socialAddress = await fakesdk.createSocialIdentityfromWalletAddress(
      walletAddress
    );
  }
  return socialAddress;
};

export const getGraph = async (socialAddress: HexString): Promise<Graph> => {
  const graph = await fakesdk.getGraphFromSocialIdentity(socialAddress);
  if (!graph) throw new Error("Invalid Social Identity Address");
  return graph;
};

export const getProfile = async (
  socialAddress: HexString
): Promise<Profile> => {
  const profile = await fakesdk.getProfileFromSocialIdentity(socialAddress);
  if (!profile) throw new Error("Invalid Social Identity Address");
  return profile;
};

export const sendPost = async (post: FeedItem<ActivityPub>): Promise<void> => {
  if (!post.content) return;

  const hash = await storeActivityPub(post.content);
  const announcement = await buildAndSignPostAnnouncement(hash, post);

  const batchData = await core.batch.createFile(hash + ".parquet", [
    announcement,
  ]);

  const publication = buildPublication(
    batchData,
    core.announcements.AnnouncementType.Broadcast
  );

  await core.contracts.publisher.publish([publication]);
};

export const sendReply = async (
  reply: FeedItem<ActivityPub>
): Promise<void> => {
  if (!reply.content || !reply.content.inReplyTo) return;

  const hash = await storeActivityPub(reply.content);
  const announcement = await buildAndSignReplyAnnouncement(
    hash,
    reply.fromAddress,
    reply.content.inReplyTo
  );

  const batchData = await core.batch.createFile(hash + ".parquet", [
    announcement,
  ]);

  const publication = buildPublication(
    batchData,
    core.announcements.AnnouncementType.Reply
  );

  await core.contracts.publisher.publish([publication]);
};

export const startPostSubscription = (
  dispatch: ThunkDispatch<any, Record<string, any>, AnyAction>
): void => {
  dispatch(clearFeedItems());
  core.contracts.subscription.subscribeToBatchPublications(
    handleBatchAnnouncement(dispatch),
    {
      announcementType: AnnouncementType.Broadcast,
    }
  );
  core.contracts.subscription.subscribeToBatchPublications(
    handleBatchAnnouncement(dispatch),
    {
      announcementType: AnnouncementType.Reply,
    }
  );
};

export const setupProvider = (): void => {
  const global: any = window;
  const eth = global.ethereum;

  if (!eth) {
    throw new Error(
      "Could not create provider, because ethereum has not been set"
    );
  }

  const provider = new providers.Web3Provider(eth);
  setConfig({
    provider: provider,
    signer: provider.getSigner(),
    store: new Store(),
  });
};

const buildPublication = (
  batchData: BatchFileData,
  type: AnnouncementType.Broadcast | AnnouncementType.Reply
): Publication => {
  return {
    announcementType: type,
    fileUrl: batchData.url.toString(),
    fileHash: "0x" + batchData.hash,
  };
};

const dispatchFeedItem = (
  dispatch: Dispatch,
  message: BroadcastAnnouncement | ReplyAnnouncement,
  activityPub: ActivityPub,
  blockNumber: number
) => {
  const decoder = new TextDecoder();
  dispatch(
    addFeedItem({
      fromAddress: decoder.decode((message.fromId as any) as Uint8Array),
      blockNumber: blockNumber,
      hash: decoder.decode((message.contentHash as any) as Uint8Array),
      timestamp: new Date().getTime(),
      uri: decoder.decode((message.url as any) as Uint8Array),
      content: {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        actor: "actor",
        content: activityPub.content || "",
        inReplyTo: activityPub.inReplyTo || undefined,
      },
    })
  );
};

const handleBatchAnnouncement = (dispatch: Dispatch) => (
  announcement: BatchPublicationCallbackArgs
) => {
  core.batch
    .openURL((announcement.fileUrl.toString() as any) as URL)
    .then((reader: any) =>
      core.batch.readFile(reader, (announcementRow: AnnouncementType) => {
        const message = (announcementRow as unknown) as BroadcastAnnouncement;
        const decoder = new TextDecoder();

        const url = decoder.decode((message.url as any) as Uint8Array);
        fetch(url)
          .then((res) => res.json())
          .then((activityPub) =>
            dispatchFeedItem(
              dispatch,
              message,
              activityPub,
              announcement.blockNumber
            )
          )
          .catch((err) => console.log(err));
      })
    );
};

const storeActivityPub = async (content: ActivityPub): Promise<string> => {
  const hash = keccak256(core.activityPub.serialize(content));

  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${encodeURIComponent(
      hash + ".json"
    )}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );
  return hash;
};

const buildAndSignPostAnnouncement = async (
  hash: string,
  post: FeedItem<ActivityPub>
): Promise<SignedBroadcastAnnouncement> => ({
  ...core.announcements.createBroadcast(
    post.fromAddress,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});

const buildAndSignReplyAnnouncement = async (
  hash: string,
  replyFromAddress: HexString,
  replyInReplyTo: HexString
): Promise<SignedReplyAnnouncement> => ({
  ...core.announcements.createReply(
    replyFromAddress,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash,
    replyInReplyTo
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});
