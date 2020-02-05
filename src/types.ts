import { devices } from "playwright";

type ValueOf<T> = T[keyof T];

export type Browsers = "chromium" | "firefox" | "webkit";

export type DeviceDescriptor = ValueOf<typeof devices>;
