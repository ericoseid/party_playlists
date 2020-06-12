import http from "http";

export default class HashPasswordCallerDefault implements HashPasswordCaller {
  private static readonly REQUEST_OPTIONS = {
    hostname: "localhost",
    port: 8000,
    path: "/hash/password",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  callHashPassword(password: string): Promise<string> {
    let postData = '{"password" : "yeet"}';

    let requestOptions = {
      hostname: "::1",
      port: 8000,
      path: "/hash/password",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

    return new Promise<string>((resolve, reject) => {
      const request = http.request(requestOptions, (res) => {
        res.setEncoding("utf-8");

        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(rawData).body);
        });
      });
      request.on("error", (err) => reject(err));

      request.write('{"password" : "yeet"}');

      request.end();
    });
  }

  private generatePostData(password: string): string {
    return JSON.stringify({
      password: password,
    });
  }
}

const caller = new HashPasswordCallerDefault();
caller
  .callHashPassword("gleeeeeeent")
  .catch((err) => console.log(err))
  .then((s) => console.log(s));
