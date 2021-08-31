import React from "react";
import { Card } from "antd";
import { FeedItem, Profile } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import { ActivityContentAttachment } from "@dsnp/sdk/core/activityContent";
import ActionsBar from "./ActionsBar";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { useAppSelector } from "../redux/hooks";

interface PostProps {
  feedItem: FeedItem;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const noteContent = feedItem.content;
  const attachments = noteContent.attachment;

  const profiles: Record<DSNPUserId, Profile> = useAppSelector(
    (state) => state.profiles?.profiles || {}
  );

  return (
    <Card key={feedItem.hash} className="Post__block" bordered={false}>
      <Card.Meta
        className="Post__header"
        avatar={
          <UserAvatar
            profileAddress={feedItem.fromId}
            avatarSize={"medium"}
            avatarUrl={profiles[feedItem.fromId]?.icon?.[0]?.href}
          />
        }
        title={`@${profiles[feedItem.fromId].handle}`}
        description={
          <div className="Post__description">
            {profiles[feedItem.fromId].name || feedItem.fromId}
          </div>
        }
      />
      <PostMedia attachment={attachments as ActivityContentAttachment[]} />
      <div className="Post__caption">
        <ActionsBar published={feedItem.published} />
        <div>{noteContent.content}</div>
        <div className="Post__captionTags">
          {feedItem.tags &&
            feedItem.tags.map((tag: string) => (
              <div className="Post__captionTag">{tag}</div>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default Post;
