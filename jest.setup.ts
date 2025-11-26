import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Add any missing globals that Next.js expects
if (typeof window === "undefined") {
  global.window = {} as any;
}
