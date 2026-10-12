import { ImageResponse } from "next/og";
import { getContent } from "./content";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Open Graph preview";

async function serif(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Instrument+Serif", {
        headers: { "User-Agent": "curl/8" },
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

const BEAN =
  "M262 112c78 0 140 54 140 136 0 98-68 168-147 168-78 0-133-55-133-131 0-96 63-173 140-173Z";

/** Site-styled OG card: dark, orange bean mark, serif title. */
export async function renderOg({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const { site } = await getContent();
  const font = await serif();
  const open = site.career.available;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0805",
        color: "#f7efe6",
        position: "relative",
      }}
    >
      <svg
        width="560"
        height="560"
        viewBox="0 0 512 512"
        style={{ position: "absolute", right: -120, top: -60, opacity: 0.22 }}
      >
        <path d={BEAN} fill="#FF7A1A" />
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="64" height="64" viewBox="0 0 512 512">
          <rect
            x="24"
            y="24"
            width="464"
            height="464"
            rx="112"
            fill="#120c07"
            stroke="#FF8A33"
            strokeWidth="8"
          />
          <path d={BEAN} fill="#FF7A1A" />
          <path
            d="M280 160c-37 35-42 72-19 108 21 33 15 67-16 98"
            fill="none"
            stroke="#120a04"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ fontSize: 30, display: "flex" }}>{site.name}</div>
        <div
          style={{
            fontSize: 22,
            color: "#FF7A1A",
            marginLeft: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {eyebrow}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: font ? "Serif" : undefined,
            fontSize: title.length > 40 ? 78 : 104,
            lineHeight: 1.02,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 30,
              color: "#c9b8a6",
              maxWidth: 960,
              display: "flex",
            }}
          >
            {subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}
      >
        {open ? (
          <>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                background: "#FF7A1A",
              }}
            />
            <div style={{ display: "flex", color: "#FF7A1A" }}>
              {`${site.career.headline} · ${site.career.roles.join(" · ")}`}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", color: "#c9b8a6" }}>{site.role}</div>
        )}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: font
        ? [{ name: "Serif", data: font, style: "normal", weight: 400 }]
        : [],
    },
  );
}
