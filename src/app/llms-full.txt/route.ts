import { llmsText } from "@/lib/llms";

export const revalidate = 60;

export function GET() {
  return llmsText(true);
}
