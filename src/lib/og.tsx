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

const ACCENT = "#FF8A3D";

/** The hero's robot-heads bot, redrawn as SVG (satori can't run its canvas). */
function RobotSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 300 345">
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB070" />
          <stop offset="0.5" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#C4541F" />
        </linearGradient>
        <radialGradient id="bulb" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d4cf" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="330" rx="95" ry="12" fill="#000" opacity="0.45" />
      <circle cx="150" cy="22" r="34" fill={ACCENT} opacity="0.18" />
      <rect x="146" y="30" width="8" height="52" rx="4" fill="#cfc8c0" />
      <circle cx="150" cy="22" r="14" fill="url(#bulb)" />
      <rect x="128" y="76" width="44" height="14" rx="6" fill="#3a2414" />
      <rect x="10" y="168" width="26" height="54" rx="12" fill="#3a2414" />
      <rect x="264" y="168" width="26" height="54" rx="12" fill="#3a2414" />
      <rect x="28" y="86" width="244" height="218" rx="56" fill="url(#shell)" />
      <rect x="62" y="116" width="176" height="158" rx="34" fill="#1d1a19" />
      <rect x="68" y="122" width="164" height="146" rx="30" fill="#141211" />
      <rect x="112" y="168" width="22" height="26" rx="3" fill="#fff6ec" />
      <rect x="166" y="168" width="22" height="26" rx="3" fill="#fff6ec" />
      <rect x="126" y="222" width="48" height="6" rx="3" fill="#fff6ec" />
    </svg>
  );
}

/**
 * Site-styled OG card that mirrors the home hero: warm dark background with
 * orange bean glows, numbered eyebrow, serif headline, tagline, the
 * open-to-roles line and the robot head on the right.
 */
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
  const career = site.career;
  const fs = title.length > 44 ? 62 : title.length > 26 ? 78 : 96;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#141110",
        color: "#f7efe6",
        backgroundImage:
          "radial-gradient(circle at 92% 18%, rgba(255,122,31,0.38), rgba(255,122,31,0) 42%), radial-gradient(circle at 4% 92%, rgba(255,122,31,0.26), rgba(255,122,31,0) 38%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 0 0 80px",
          width: 780,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a89a8c",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 512 512">
            <rect
              x="24"
              y="24"
              width="464"
              height="464"
              rx="112"
              fill="#120c07"
              stroke={ACCENT}
              strokeWidth="10"
            />
            <path d={BEAN} fill={ACCENT} />
            <path
              d="M280 160c-37 35-42 72-19 108 21 33 15 67-16 98"
              fill="none"
              stroke="#120a04"
              strokeWidth="22"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ color: ACCENT }}>01/</span>
          <span>{eyebrow}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: font ? "Serif" : undefined,
            fontSize: fs,
            lineHeight: 1.0,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#d8cabc",
              maxWidth: 680,
            }}
          >
            {subtitle.length > 120 ? `${subtitle.slice(0, 117)}…` : subtitle}
          </div>
        ) : null}
        {career.available ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 14,
                  background: ACCENT,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: font ? "Serif" : undefined,
                  fontSize: 32,
                }}
              >
                {career.headline}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 28,
                fontSize: 20,
                letterSpacing: 1,
                color: "#a89a8c",
              }}
            >
              {career.roles.join("  ·  ")}
              {career.locations ? `   —   ${career.locations}` : ""}
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RobotSvg size={300} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 34,
          display: "flex",
          fontSize: 20,
          color: "#a89a8c",
        }}
      >
        {site.name}
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
