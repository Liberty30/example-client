import React from "react";
import Post from "./Post";
import { FeedItem, Graph, Profile } from "../utilities/types";
import { useAppSelector } from "../redux/hooks";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";
import Masonry from "react-masonry-css";

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

  currentFeed.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  const items = currentFeed
    .slice(0)
    .reverse()
    .map((post, index) => {
      if (!post.fromAddress) throw new Error(`no fromAddress in post: ${post}`);

      const fromAddress: string =
        profiles[post.fromAddress] && profiles[post.fromAddress].name
          ? (profiles[post.fromAddress].name as string)
          : post.fromAddress;

      const namedPost: FeedItem<ActivityContentNote> = {
        ...post,
        fromAddress: fromAddress,
        timestamp: post.timestamp,
        tags: ["#foodee"],
      };
      return <Post key={index} feedItem={namedPost} />;
    });

  return (
    <Masonry
      breakpointCols={3}
      className="PostList__block"
      columnClassName="PostList__blockColumn"
    >
      {items}
    </Masonry>
  );
};
export default PostList;
