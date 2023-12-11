import http from "http";
import path from "path";
import querystring from "querystring";
import { FunctionValue, Value } from "../../types";
import {
  FalseReturnError,
  mkArray,
  mkNativeFunction,
  mkNull,
  mkNumber,
  mkObject,
  mkString,
} from "../../utils";

const httpServer: [string, Value][] = [
  [
    "server",
    mkNativeFunction((args, env) => {
      const fn: any = args[0];

      const server = http.createServer(async (req, res) => {
        const reqArg = await makeRequestObject(req);
        const resArg = makeResponseObject(res);

        try {
          fn._i.handleFunctionValueCall(fn, [reqArg, resArg], env!);
        } catch (error) {
          if (!(error instanceof FalseReturnError)) throw Error;
        }
      });

      return mkObject([
        [
          "listen",
          mkNativeFunction((args) => {
            const port = args[0].value;
            server.listen(port);
            return mkNull();
          }),
        ],
      ]);
    }),
  ],
];
export default httpServer;

async function makeRequestObject(req: http.IncomingMessage) {
  const headers = req.headers;
  const headersObj: [string, Value][] = [];

  for (const header of Object.keys(headers)) {
    const val = headers[header];
    const value =
      typeof val === "string"
        ? mkString(val)
        : Array.isArray(val)
        ? mkArray(val.map((el) => mkString(el)))
        : mkNull();

    headersObj.push([header, value]);
  }

  const body = await getBody(req);

  return mkObject([
    ["headers", mkObject(headersObj)],
    ["status_code", req.statusCode ? mkNumber(req.statusCode) : mkNull()],
    ["url", req.url ? mkString(req.url) : mkNull()],
    ["method", req.method ? mkString(req.method) : mkNull()],
    ["body", mkString(body)],
  ]);
}

function makeResponseObject(
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) {
  return mkObject([
    [
      "send",
      mkNativeFunction((args) => {
        const val = args[0].value || "";
        res.write(val);
        res.end();
        return mkNull();
      }),
    ],
    [
      "set_header",
      mkNativeFunction((args) => {
        const key = args[0].value || "";
        const val = args[1].value || "";
        res.setHeader(key, val);
        return mkNull();
      }),
    ],
  ]);
}

function getBody(request: http.IncomingMessage) {
  return new Promise<string>((resolve) => {
    const bodyParts: any[] = [];
    request
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(bodyParts).toString();
        resolve(body);
      });
  });
}
