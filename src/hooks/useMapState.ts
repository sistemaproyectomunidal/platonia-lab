/**
 * useMapState - Map State Management Hook
 * Manages the state of the Lagrange map including selection, zoom, and active episode
 */

import { useState, useCallback } from 'react';
import type { Node, Episode, MapState } from '@/types';

interface UseMapStateReturn {
  // Node selection
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  clearSelection: () => void;
  
  // Hover state
  hoveredNode: Node | null;
  setHoveredNode: (node: Node | null) => void;
  
  // Zoom controls
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // Pan position
  panPosition: { x: number; y: number };
  setPanPosition: (position: { x: number; y: number }) => void;
  
  // Active episode (for audio player)
  activeEpisode: Episode | null;
  setActiveEpisode: (episode: Episode | null) => void;
  
  // Full state
  state: MapState;
}

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function useMapState(initialZoom: number = DEFAULT_ZOOM): UseMapStateReturn {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [zoom, setZoomState] = useState<number>(initialZoom);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom)));
  }, []);

  const zoomIn = useCallback(() => {
    setZoomState((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomState(DEFAULT_ZOOM);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const state: MapState = {
    selectedNode,
    hoveredNode,
    zoom,
    activeEpisode,
    panPosition,
  };

  return {
    selectedNode,
    setSelectedNode,
    clearSelection,
    hoveredNode,
    setHoveredNode,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    panPosition,
    setPanPosition,
    activeEpisode,
    setActiveEpisode,
    state,
  };
}

export default useMapState;
