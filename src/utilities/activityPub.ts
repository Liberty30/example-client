import {
  NoteActivityPub,
  ActivityPubAttachment,
  PubType,
} from "./activityPubTypes";
import { HexString } from "./types";
import path from "path";

export const noteToActivityPub = (
  actor: HexString,
  note: string,
  uriList: string[]
): NoteActivityPub => {
  const activityPub: NoteActivityPub = {
    actor,
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    content: note,
  };
  if (uriList) {
    if (typeof uriList === "string") {
      uriList = [uriList];
    }
    activityPub["attachment"] = uriList.map(
      (item): ActivityPubAttachment => {
        const extension = path.extname(item).replace(".", "");
        let mediaType;
        let pubType: PubType = "Image";
        const supportedVideoDomains = /youtu.be|youtube.com|vimeo.com/;
        if (supportedVideoDomains.test(item)) {
          pubType = "Video";
          mediaType = "text/html";
        } else {
          switch (extension) {
            case "mp4":
              pubType = "Video";
              mediaType = "video/mp4";
              break;
            case "wmv":
              pubType = "Video";
              mediaType = "video/x-ms-wmv";
              break;
            case "mov":
              pubType = "Video";
              mediaType = "video/quicktime";
              break;
            default:
              mediaType = `image/${extension}`;
          }
        }
        return { type: pubType, mediaType: mediaType, url: item };
      }
    );
  }
  return activityPub;
};

export const postReplyToActivityPub = (
  actor: HexString,
  reply: string,
  parent: HexString
): NoteActivityPub => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    actor,
    type: "Note",
    content: reply,
    inReplyTo: parent,
  };
};
