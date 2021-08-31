import React, { useState } from "react";
import RelativeTime from "./RelativeTime";
import CommentIcon from "../images/CommentIcon.svg";
import LikeIcon from "../images/LikeIcon.svg";
import FullLikeIcon from "../images/FullLikeIcon.svg";
import ConnectIcon from "../images/ConnectIcon.svg";

interface ActionsBarProps {
  published: string;
}

const ActionsBar = ({ published }: ActionsBarProps): JSX.Element => {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className="ActionsBar__block">
      <RelativeTime published={published} postStyle={true} />
      <div className="ActionsBar__iconList">
        {!isLiked ? (
          <img
            src={LikeIcon}
            alt="like icon"
            onClick={() => setIsLiked(true)}
          />
        ) : (
          <img
            src={FullLikeIcon}
            alt="like icon"
            onClick={() => setIsLiked(false)}
          />
        )}
        <img src={CommentIcon} alt="comments icon" />
        <img src={ConnectIcon} alt="connect icon" />
      </div>
    </div>
  );
};

export default ActionsBar;
