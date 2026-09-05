import "server-only";

import { unstable_cache } from "next/cache";
import {
  publicContentCacheTags,
  type PublicContentCacheTag,
} from "@/content/cache-tags";

export { publicContentCacheTags, type PublicContentCacheTag };

export function cachePublicContent<T>(
  tag: PublicContentCacheTag,
  load: () => Promise<T>,
): Promise<T> {
  return unstable_cache(load, [tag], { tags: [tag] })();
}
