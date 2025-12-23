import { useCallback, useEffect, useRef } from "react";
import { useMapState } from "@/hooks/useMapState";
import { fetchNodes, fetchEdges } from "@/utils/dataLoader";
import type { Node, Edge } from "@/types";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LagrangeMapProps {
  onNodeSelect?: (node: Node) => void;
  initialZoom?: number;
}

const LagrangeMap = ({ onNodeSelect, initialZoom = 1 }: LagrangeMapProps) => {
  const {
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    clearSelection,
  } = useMapState(initialZoom);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      nodesRef.current = await fetchNodes();
      edgesRef.current = await fetchEdges();
    };
    loadData();
  }, []);

  const getNodeColor = (
    state: string | undefined,
    isHovered: boolean,
    isSelected: boolean
  ) => {
    if (isSelected) return "hsl(38, 80%, 60%)";
    if (isHovered) return "hsl(38, 70%, 55%)";
    switch (state) {
      case "active":
        return "hsl(38, 70%, 50%)";
      case "latent":
        return "hsl(220, 40%, 45%)";
      case "saturated":
        return "hsl(0, 50%, 45%)";
      default:
        return "hsl(45, 5%, 55%)";
    }
  };

  const handleNodeClick = useCallback(
    (node: Node) => {
      const isDeselecting = selectedNode?.id === node.id;
      setSelectedNode(isDeselecting ? null : node);
      if (!isDeselecting) {
        onNodeSelect?.(node);
      }
    },
    [selectedNode, setSelectedNode, onNodeSelect]
  );

  // Load external SVG and bind interactions
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/svg/map.svg");
        if (!res.ok) throw new Error("No SVG");
        const text = await res.text();
        if (!mounted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        const imported = document.importNode(svg, true) as SVGSVGElement;
        imported.setAttribute("class", "w-full h-full");
        imported.setAttribute("role", "img");
        imported.style.transform = `scale(${zoom})`;
        imported.style.transformOrigin = "center center";
        imported.style.transition = "transform 0.3s ease";
        containerRef.current.appendChild(imported);

        // Wait for nodes data
        if (nodesRef.current.length === 0) {
          nodesRef.current = await fetchNodes();
        }

        // Bind node interactions
        nodesRef.current.forEach((n) => {
          const el = imported.querySelector(`[data-node-id="${n.id}"]`);
          if (!el) return;

          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", n.label);

          const circle = el.querySelector("circle");

          const applyStyle = (isHovered: boolean, isSelected: boolean) => {
            const color = getNodeColor(n.state, isHovered, isSelected);
            if (circle instanceof SVGElement)
              circle.setAttribute("fill", color);
            if (isHovered || isSelected)
              el.setAttribute("filter", "url(#glow)");
            else el.removeAttribute("filter");
          };

          const onEnter = () => {
            setHoveredNode(n);
            applyStyle(true, selectedNode?.id === n.id);
          };

          const onLeave = () => {
            setHoveredNode(null);
            applyStyle(false, selectedNode?.id === n.id);
          };

          const onClick = () => handleNodeClick(n);

          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          el.addEventListener("click", onClick);
          el.addEventListener("focus", onEnter);
          el.addEventListener("blur", onLeave);
          el.addEventListener("keydown", (e: Event) => {
            if (
              (e as KeyboardEvent).key === "Enter" ||
              (e as KeyboardEvent).key === " "
            ) {
              onClick();
            }
          });

          (el as HTMLElement & { __cleanup?: () => void }).__cleanup = () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("click", onClick);
            el.removeEventListener("focus", onEnter);
            el.removeEventListener("blur", onLeave);
          };
        });
      } catch (e) {
        console.warn("External SVG load failed, using fallback");
      }
    };

    load();

    return () => {
      mounted = false;
      if (containerRef.current) {
        const svgel = containerRef.current.querySelector("svg");
        if (svgel) {
          const nodesEls = svgel.querySelectorAll("[data-node-id]");
          nodesEls.forEach((el) => {
            const c = (el as HTMLElement & { __cleanup?: () => void })
              .__cleanup;
            if (typeof c === "function") c();
          });
        }
      }
    };
  }, []);

  // Update zoom
  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (svg) {
      svg.style.transform = `scale(${zoom})`;
    }
  }, [zoom]);

  // Update SVG visuals when hovered/selected changes
  useEffect(() => {
    if (!containerRef.current) return;
    const svgel = containerRef.current.querySelector("svg");
    if (!svgel) return;

    nodesRef.current.forEach((n) => {
      const el = svgel.querySelector(`[data-node-id="${n.id}"]`);
      if (!el) return;

      const circle = el.querySelector("circle");
      const isHovered = hoveredNode?.id === n.id;
      const isSelected = selectedNode?.id === n.id;
      const color = getNodeColor(n.state, isHovered, isSelected);

      if (circle instanceof SVGElement) circle.setAttribute("fill", color);
      if (isHovered || isSelected) el.setAttribute("filter", "url(#glow)");
      else el.removeAttribute("filter");
    });

    const edgeEls = svgel.querySelectorAll(
      "[data-edge-source][data-edge-target]"
    );
    edgeEls.forEach((edgeEl) => {
      const src = edgeEl.getAttribute("data-edge-source");
      const tgt = edgeEl.getAttribute("data-edge-target");
      const isHighlighted = hoveredNode?.id === src || hoveredNode?.id === tgt;
      const isConnected = selectedNode?.id === src || selectedNode?.id === tgt;

      const opacity = isHighlighted ? "0.8" : isConnected ? "0.6" : "0.15";
      (edgeEl as SVGElement).setAttribute("opacity", opacity);

      if (isHighlighted) {
        (edgeEl as SVGElement).removeAttribute("stroke-dasharray");
      } else {
        (edgeEl as SVGElement).setAttribute("stroke-dasharray", "4 4");
      }
    });
  }, [hoveredNode, selectedNode, getNodeColor]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-background rounded-lg overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(38 70% 50% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          className="bg-card/80 backdrop-blur-sm"
          aria-label="Acercar"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          className="bg-card/80 backdrop-blur-sm"
          aria-label="Alejar"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetZoom}
          className="bg-card/80 backdrop-blur-sm"
          aria-label="Restablecer zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs font-system text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>

      {/* SVG container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Selected node detail panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-philosophy text-lg text-foreground">
                {selectedNode.label}
              </h3>
              <span className="font-system text-xs text-primary">
                [{selectedNode.axis}]
              </span>
            </div>
            <button
              onClick={clearSelection}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {selectedNode.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: getNodeColor(selectedNode.state, false, false),
              }}
            />
            <span className="font-system text-xs text-muted-foreground uppercase">
              {selectedNode.state || "latent"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LagrangeMap;
