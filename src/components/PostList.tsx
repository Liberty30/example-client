import React from "react";
import Post from "./Post";
import { FeedItem, Graph, Profile } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

interface PostListProps {
  feedType: FeedTypes;
}

const PostList = ({ feedType }: PostListProps): JSX.Element => {
  const profile: Profile | undefined = useAppSelector(
    (state) => state.user.profile
  );
  const graph: Graph[] = useAppSelector((state) => state.graphs.graphs);
  const myGraph: Graph | undefined = graph.find(
    (graph) => graph.socialAddress === profile?.socialAddress
  );
  const feed: FeedItem<ActivityContentNote>[] = useAppSelector(
    (state) => state.feed.feed
  ).filter(
    (post) => post?.content?.type === "Note" && post?.inReplyTo === undefined
  );
  const profiles: Record<HexString, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );
  let currentFeed: FeedItem<ActivityContentNote>[] = [];

  if (feedType === FeedTypes.FEED) {
    const addrSet = profile?.socialAddress
      ? { [profile.socialAddress]: true }
      : {};
    myGraph?.following.forEach((addr) => (addrSet[addr] = true));
    currentFeed = feed.filter((post) => post?.fromAddress in addrSet);
  } else if (feedType === FeedTypes.MY_POSTS) {
    currentFeed = feed.filter(
      (post) => profile?.socialAddress === post?.fromAddress
    );
  } else {
    currentFeed = feed;
  }

  return (
    <div className="PostList__block">
      {currentFeed.length > 0 ? (
        <>
          {currentFeed
            .slice(0)
            .reverse()
            .map((post, index) => {
              if (!post.fromAddress)
                throw new Error(`no fromAddress in post: ${post}`);

              const fromAddress: string = profiles[post.fromAddress]
                ? (profiles[post.fromAddress].name as string)
                : post.fromAddress;

              const namedPost: FeedItem<ActivityContentNote> = {
                ...post,
                fromAddress: fromAddress,
                timestamp: Math.floor(Math.random() * 999999),
                tags: ["#foodee"],
              };
              return <Post key={index} feedItem={namedPost} />;
            })}
        </>
      ) : (
        "Empty FeedNavigation!"
      )}
    </div>
  );
};
export default PostList;
