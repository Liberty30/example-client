import React from "react";
import { Avatar } from "antd";
import { HexString } from "../utilities/types";

const avatarSizeOptions = new Map([
  ["small", 32],
  ["medium", 50],
  ["large", 100],
]);

interface UserAvatarProps {
  profileAddress: HexString | undefined;
  avatarSize: string;
}

const UserAvatar = ({
  profileAddress,
  avatarSize,
}: UserAvatarProps): JSX.Element => {
  const identiconURL =
    "http://localhost:8080/440px-Hans_Ulrich_Obrist_2017.jpg";
  return (
    <Avatar
      alt={profileAddress || "anonymous"}
      src={identiconURL}
      size={avatarSizeOptions.get(avatarSize)}
    />
  );
};

export default UserAvatar;
