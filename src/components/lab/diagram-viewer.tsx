"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import type { Diagram, DiagramNode, DiagramPoint } from "@/content/types";
import { cn } from "@/lib/utils";
import { useT } from "@/components/site/labels-provider";

const W = 140;
const H = 52;

/** Bean outline in a W×H box — same asymmetric bean as the site identity. */
const BEAN =
  "M74 3C113 1 137 12 137 27C137 43 112 51 70 50C29 49 3 42 3 27C3 13 31 5 74 3Z";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

const KIND_STYLE: Record<DiagramNode["kind"], string> = {
  client: "fill-background stroke-foreground/40",
  edge: "fill-primary/15 stroke-primary",
  service: "fill-secondary stroke-foreground/50",
  data: "fill-primary/30 stroke-primary",
  external: "fill-background stroke-foreground/30 [stroke-dasharray:4_3]",
};

type Tab = "decisions" | "tradeoffs" | "bottlenecks" | "failures";
const TABS: Tab[] = ["decisions", "tradeoffs", "bottlenecks", "failures"];

export function DiagramViewer({ diagram }: { diagram: Diagram }) {
  const t = useT();
  const [selected, setSelected] = useState<string | null>(
    diagram.nodes[0]?.id ?? null,
  );
  const [flowId, setFlowId] = useState(diagram.flows[0]?.id ?? null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<Tab>("decisions");
  const [point, setPoint] = useState<DiagramPoint | null>(null);

  const flow = diagram.flows.find((f) => f.id === flowId);
  const nodeById = useMemo(
    () => new Map(diagram.nodes.map((n) => [n.id, n])),
    [diagram.nodes],
  );
  const activeEdge = flow && step >= 0 ? flow.steps[step]?.edge : undefined;
  const failed =
    tab === "failures" && point ? new Set(point.nodes) : new Set<string>();
  const reducedMotion = useReducedMotion();
  const activeEdgeDef = diagram.edges.find((e) => e.id === activeEdge);
  const activeNodes = new Set(
    activeEdgeDef ? [activeEdgeDef.from, activeEdgeDef.to] : [],
  );
  const highlighted = point ? new Set(point.nodes) : new Set<string>();

  useEffect(() => {
    if (!playing || !flow) return;
    const t = setTimeout(
      () => {
        if (step >= flow.steps.length - 1) setPlaying(false);
        else setStep((s) => s + 1);
      },
      step < 0 ? 0 : 1800,
    );
    return () => clearTimeout(t);
  }, [playing, step, flow]);

  const width = Math.max(...diagram.nodes.map((n) => n.x)) + W + 40;
  const height = Math.max(...diagram.nodes.map((n) => n.y)) + H + 40;
  const sel = selected ? nodeById.get(selected) : undefined;
  const points = diagram[tab];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        <div className="border-border bg-card/40 overflow-x-auto rounded-2xl border p-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="min-w-[640px]"
            role="group"
            aria-label={`${diagram.title} diagram`}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 10 5 0 10z" className="fill-muted-foreground" />
              </marker>
            </defs>
            {diagram.edges.map((e, i) => {
              const a = nodeById.get(e.from);
              const b = nodeById.get(e.to);
              if (!a || !b) return null;
              const x1 = a.x + W / 2,
                y1 = a.y + H / 2,
                x2 = b.x + W / 2,
                y2 = b.y + H / 2;
              const ang = Math.atan2(y2 - y1, x2 - x1);
              const inset = Math.min(
                (W / 2 - 6) / Math.abs(Math.cos(ang) || 1e-6),
                (H / 2 - 2) / Math.abs(Math.sin(ang) || 1e-6),
              );
              const sx = x1 + Math.cos(ang) * inset,
                sy = y1 + Math.sin(ang) * inset,
                ex = x2 - Math.cos(ang) * (inset + 4),
                ey = y2 - Math.sin(ang) * (inset + 4);
              const d = `M${sx} ${sy} L${ex} ${ey}`;
              const active = e.id === activeEdge;
              return (
                <g key={e.id}>
                  <path
                    d={d}
                    pathLength={1}
                    markerEnd="url(#arrow)"
                    style={{ ["--delay" as string]: `${200 + i * 90}ms` }}
                    className={cn(
                      "edge-draw fill-none transition-[stroke,stroke-width] duration-300",
                      active ? "stroke-primary" : "stroke-muted-foreground/50",
                    )}
                    strokeWidth={active ? 2 : 1.2}
                  />
                  {active ? (
                    <path
                      d={d}
                      className="flow-dash stroke-primary/60 fill-none"
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                  ) : null}
                  {active && !reducedMotion ? (
                    <circle r={4} className="fill-primary">
                      <animateMotion
                        dur="1.4s"
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  ) : null}
                  {e.label ? (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono text-[10px]"
                    >
                      {e.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {diagram.nodes.map((n) => {
              const isSel = n.id === selected;
              const isFailed = failed.has(n.id);
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${n.label}: ${n.description}`}
                  onClick={() => setSelected(n.id)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    (e.preventDefault(), setSelected(n.id))
                  }
                  className="cursor-pointer outline-none [&:focus-visible>path]:stroke-ring"
                >
                  <path
                    d={BEAN}
                    transform={`translate(${n.x} ${n.y})`}
                    strokeWidth={isSel || highlighted.has(n.id) ? 2.2 : 1.2}
                    className={cn(
                      "bean-node transition-[fill,stroke,stroke-width] duration-300",
                      isFailed
                        ? "fill-destructive/20 stroke-destructive"
                        : KIND_STYLE[n.kind],
                      isSel && !isFailed && "stroke-primary",
                      (isSel || activeNodes.has(n.id)) &&
                        !isFailed &&
                        "bean-active",
                    )}
                  />
                  <text
                    x={n.x + W / 2}
                    y={n.y + H / 2 + 4}
                    textAnchor="middle"
                    className={cn(
                      "text-[13px]",
                      isFailed
                        ? "fill-destructive line-through"
                        : "fill-foreground",
                    )}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + W / 2}
                    y={n.y + H + 14}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[9px] uppercase"
                  >
                    {n.kind}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {diagram.flows.length ? (
          <div className="border-border rounded-2xl border p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-2">{t("diagram.flow")}</span>
              {diagram.flows.map((f) => (
                <button
                  key={f.id}
                  onClick={() => (
                    setFlowId(f.id),
                    setStep(-1),
                    setPlaying(false)
                  )}
                  className={cn(
                    "chip",
                    f.id === flowId && "border-primary text-foreground",
                  )}
                  aria-pressed={f.id === flowId}
                >
                  {f.name}
                </button>
              ))}
              <span className="ml-auto flex gap-1">
                <Button
                  size="icon-sm"
                  variant="outline"
                  aria-label={playing ? "Pause flow" : "Play flow"}
                  onClick={() => {
                    if (flow && step >= flow.steps.length - 1) setStep(-1);
                    setPlaying((p) => !p);
                  }}
                >
                  {playing ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Reset flow"
                  onClick={() => (setStep(-1), setPlaying(false))}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </span>
            </div>
            {flow ? (
              <ol className="mt-4 space-y-2" aria-live="polite">
                {flow.steps.map((s, i) => (
                  <li key={i}>
                    <button
                      onClick={() => (setStep(i), setPlaying(false))}
                      className={cn(
                        "flex w-full gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        i === step
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span className="tag pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.text}
                    </button>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        ) : null}
      </div>

      <aside className="space-y-6">
        <div
          className="border-border rounded-2xl border p-5"
          aria-live="polite"
        >
          <p className="eyebrow">{t("diagram.component")}</p>
          {sel ? (
            <>
              <p className="mt-2 font-serif text-2xl">{sel.label}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {sel.description}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">
              {t("diagram.select")}
            </p>
          )}
        </div>
        <div>
          <div role="tablist" className="flex flex-wrap gap-1">
            {TABS.map((tabId) => (
              <button
                key={tabId}
                role="tab"
                aria-selected={tab === tabId}
                onClick={() => (setTab(tabId), setPoint(null))}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition-colors",
                  tab === tabId
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(`diagram.${tabId}`)}
              </button>
            ))}
          </div>
          <ul role="tabpanel" className="mt-4 space-y-3">
            {points.length === 0 ? (
              <li className="text-muted-foreground text-sm">
                {t("diagram.none")}
              </li>
            ) : null}
            {points.map((p) => (
              <li key={p.title}>
                <button
                  onClick={() => setPoint(point?.title === p.title ? null : p)}
                  aria-pressed={point?.title === p.title}
                  className={cn(
                    "border-border w-full rounded-xl border p-4 text-left transition-colors",
                    point?.title === p.title &&
                      (tab === "failures"
                        ? "border-destructive"
                        : "border-primary"),
                  )}
                >
                  <p className="font-medium">{p.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{p.body}</p>
                  {tab === "failures" ? (
                    <p className="tag mt-2">
                      {point?.title === p.title
                        ? t("diagram.simulating")
                        : t("diagram.simulate")}
                    </p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
