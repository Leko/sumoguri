import puppeteer, { Page, Browser } from "puppeteer";
import { Viewport } from "./Viewport";

export type Result = {
  binary: Buffer;
  hrefs: string[];
};

export class Worker {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private locale: string;
  private viewport: Viewport;
  private prefersColorScheme: string;
  private disableCssAnimation: boolean;

  constructor({ locale, viewport, prefersColorScheme, disableCssAnimation }: { locale: string; prefersColorScheme: string; viewport: Viewport, disableCssAnimation: boolean }) {
    this.locale = locale;
    this.viewport = viewport;
    this.prefersColorScheme = prefersColorScheme;
    this.disableCssAnimation = disableCssAnimation;
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
      props.map(href => href.jsonValue() as Promise<string>)
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
      const [width, height] = this.viewport;
      this.browser = await puppeteer.launch({
        args: [`--lang=${this.locale}`]
      });
      const page = await this.browser.newPage();
      await page.setViewport({ width, height });
      await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: this.prefersColorScheme }
      ])
      if (this.disableCssAnimation) {
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              transition: none !important;
              animation: none !important;
            }
          `
        });
      }

      this.page = page;
    }

    return this.page;
  }
}
