import { filenamify } from "./filename";
import { QueueItem } from "../QueueItem";

describe("filenamify", () => {
  it("returns flat path when flat is true", () => {
    const item = new QueueItem({
      locale: "en-US",
      deviceDescriptor: {
        name: "nope",
        userAgent: "nope",
        viewport: {
          width: 100,
          height: 100
        }
      },
      browserName: "chromium",
      url: new URL("http://localhost/hoge/foo/bar")
    });
    const filename = filenamify(item, true);
    expect(filename).toBe("chromium-en-US-100x100--hoge-foo-bar.png");
  });
  it("returns path when flat is false", () => {
    const item = new QueueItem({
      locale: "en-US",
      deviceDescriptor: {
        name: "nope",
        userAgent: "nope",
        viewport: {
          width: 100,
          height: 100
        }
      },
      browserName: "chromium",
      url: new URL("http://localhost/hoge/foo/bar")
    });
    const filename = filenamify(item, false);
    expect(filename).toBe("chromium/en-US/100x100/hoge/foo/bar.png");
  });
});
