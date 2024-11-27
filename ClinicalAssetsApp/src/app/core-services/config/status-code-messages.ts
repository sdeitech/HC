import { StatusCode } from "./status-code";
import { StatusMessage } from "./status-message";

const StatusCodeMessages = [
    { code: StatusCode.UnknownError, message: StatusMessage.UnknownError },
    { code: StatusCode.Unauthorized, message: StatusMessage.Unauthorized },
    { code: StatusCode.BadRequest, message: StatusMessage.BadRequest },
    { code: StatusCode.Forbidden, message: StatusMessage.Forbidden },
    { code: StatusCode.NotFound, message: StatusMessage.NotFound },
    { code: StatusCode.InternalServerError, message: StatusMessage.InternalServerError },
];

export { StatusCodeMessages };