import React, { useState } from "react";
import { Card } from "antd";
import { FeedItem } from "../utilities/types";
import UserAvatar from "./UserAvatar";
import PostMedia from "./PostMedia";
import {
  ActivityContentImage,
  ActivityContentNote,
} from "@dsnp/sdk/core/activityContent";
import ActionsBar from "./ActionsBar";

interface PostProps {
  feedItem: FeedItem<ActivityContentNote>;
}

const Post = ({ feedItem }: PostProps): JSX.Element => {
  const [showActionsBar, setShowActionsBar] = useState<boolean>(false);
  const noteContent = feedItem.content;
  const attachments =
    noteContent.attachment &&
    (Array.isArray(noteContent.attachment)
      ? noteContent.attachment
      : [noteContent.attachment]);

  return (
    <Card
      key={feedItem.hash}
      className="Post__block"
      bordered={false}
      onMouseEnter={() => setShowActionsBar(!showActionsBar)}
      onMouseLeave={() => setShowActionsBar(!showActionsBar)}
    >
      <Card.Meta
        className="Post__header"
        avatar={
          <UserAvatar
            profileAddress={feedItem.fromAddress}
            avatarSize={"medium"}
          />
        }
        title={feedItem.fromAddress}
        description={
          <div className="Post__description">{feedItem.fromAddress}</div>
        }
      />
      <div className="Post__mediaBlock">
        <PostMedia attachment={attachments as ActivityContentImage[]} />
        {showActionsBar && <ActionsBar timestamp={feedItem.timestamp} />}
      </div>
      <div className="Post__caption">
        <div>{noteContent.content}</div>
        <div className="Post__captionTags">
          {feedItem.tags && feedItem.tags[0]}
        </div>
      </div>
    </Card>
  );
};

export default Post;