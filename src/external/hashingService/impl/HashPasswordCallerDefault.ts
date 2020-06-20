import http from "http";

export default class HashPasswordCallerDefault implements HashPasswordCaller {
  private static readonly REQUEST_OPTIONS = {
    hostname: "::1",
    port: 8000,
    path: "/hash/password",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  callHashPassword(password: string): Promise<string> {
    const postData = this.generatePostData(password);

    return new Promise<string>((resolve, reject) => {
      const request = http.request(
        HashPasswordCallerDefault.REQUEST_OPTIONS,
        (res) => {
          res.setEncoding("utf-8");

          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });

          res.on("end", () => {
            resolve(JSON.parse(rawData).body);
          });
        }
      );

      request.on("error", (err) => reject(err));

      request.write(postData);

      request.end();
    });
  }

  private generatePostData(password: string): string {
    return JSON.stringify({
      password: password,
    });
  }
}
