import CompleteAccountRequestHandler from "../../requestHandlers/CompleteAccountRequestHandler";

interface CompleteUserRequest {
  username: string;
  authCode: string;
}

export function isCompleteUserRequest(
  object: any
): object is CompleteUserRequest {
  return object.username && object.authCode;
}
