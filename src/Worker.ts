import { Browser, Page, chromium, webkit, firefox } from "playwright";
import { QueueItem } from "./QueueItem";
import { Browsers, DeviceDescriptor } from "./types";

const browsers = { chromium, webkit, firefox };

export type Result = {
  binary: Buffer;
  hrefs: string[];
};

export class Worker {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private locale: string;
  private browserName: Browsers;
  private deviceDescriptor: DeviceDescriptor;

  constructor(item: QueueItem) {
    this.locale = item.locale;
    this.browserName = item.browserName;
    this.deviceDescriptor = item.deviceDescriptor;
  }

  async run({ href }: URL): Promise<Result> {
    const page = await this.getPage();
    await page.goto(href, { waitUntil: "networkidle0" });

    const binary = await page.screenshot({
      type: "png",
      fullPage: true
    });
    const hrefs = await this.getHrefs(page);

    return {
      binary,
      hrefs
    };
  }

  async getHrefs(page: Page): Promise<string[]> {
    const handles = await page.$$("a");
    const props = await Promise.all(
      handles.map(handle => handle.getProperty("href"))
    );
    const hrefs: string[] = await Promise.all(
      props.filter(Boolean).map(href => href!.jsonValue())
    );

    return hrefs;
  }

  async close(): Promise<void> {
    if (this.browser) {
      return this.browser.close();
    }
  }

  async getPage(): Promise<Page> {
    if (!this.page) {
      if (!browsers[this.browserName]) {
        throw new Error(`Unknown browser name ${this.browserName}`);
      }
      this.browser = await browsers[this.browserName].launch({
        env: {
          LANGUAGE: this.locale
        }
      });
      const ctx = await this.browser.newContext(this.deviceDescriptor);
      const page = await ctx.newPage();
      await page.setExtraHTTPHeaders({
        "Accept-Language": this.locale
      });
      await page.evaluateOnNewDocument((locale: string) => {
        Object.defineProperty(navigator, "language", {
          get: function() {
            return locale;
          }
        });
        Object.defineProperty(navigator, "languages", {
          get: function() {
            return [locale];
          }
        });
      }, this.locale);
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            transition: none !important;
            animation: none !important;
          }
        `
      });

      this.page = page;
    }

    return this.page;
  }
}
