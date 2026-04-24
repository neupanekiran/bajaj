'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const NODE_W = 64;
const NODE_H = 64;

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 60 });

  nodes.forEach((n) => dagreGraph.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => dagreGraph.setEdge(e.source, e.target));

  dagre.layout(dagreGraph);

  const laid = nodes.map((n) => {
    const pos = dagreGraph.node(n.id);
    return {
      ...n,
      targetPosition: direction === 'TB' ? 'top' : 'left',
      sourcePosition: direction === 'TB' ? 'bottom' : 'right',
      position: {
        x: pos.x - NODE_W / 2,
        y: pos.y - NODE_H / 2,
      },
    };
  });

  return { nodes: laid, edges };
}

export default function TreeGraph({ hierarchy }) {
  const { nodes, edges } = useMemo(() => {
    const rawNodes = [];
    const rawEdges = [];

    const traverse = (nodeObj, parentId = null) => {
      for (const [key, children] of Object.entries(nodeObj)) {
        if (!rawNodes.find((n) => n.id === key)) {
          rawNodes.push({
            id: key,
            data: { label: key },
            position: { x: 0, y: 0 },
            style: {
              background: '#151518',
              color: '#ffffff',
              // Updated to a subtle dark red border to match the "red box" aesthetic
              border: '2px solid #7f1d1d', 
              borderRadius: '20px',
              fontFamily: 'var(--font-space-mono), monospace',
              fontWeight: '700',
              fontSize: '18px',
              width: NODE_W,
              height: NODE_H,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // Added a subtle red glow to the node itself
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)',
              transition: 'border-color 0.2s ease',
            },
          });
        }
        if (parentId) {
          rawEdges.push({
            id: `e${parentId}-${key}`,
            source: parentId,
            target: key,
            animated: true, // Enables the flowing animation!
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#ef4444', // Red arrow head
              width: 20,
              height: 20,
            },
            style: {
              stroke: '#ef4444', // Bright neon red line
              strokeWidth: 2.5,  // Slightly thicker to see the color better
              // Creates a glowing "laser" effect around the line
              filter: 'drop-shadow(0px 0px 4px rgba(239, 68, 68, 0.8))', 
            },
          });
        }
        traverse(children, key);
      }
    };

    if (hierarchy.tree && Object.keys(hierarchy.tree).length > 0) {
      traverse(hierarchy.tree);
    }

    return getLayoutedElements(rawNodes, rawEdges);
  }, [hierarchy]);

  // ── Cycle state ──────────────────────────────────────────────
  if (hierarchy.has_cycle) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#09090b] space-y-4 p-8 text-center text-red-400">
        <svg className="w-16 h-16 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold text-lg tracking-widest uppercase" style={{ fontFamily: 'var(--font-space-mono), monospace'}}>
          CYCLE DETECTED
        </p>
        <p className="text-[#a1a1aa] text-sm max-w-sm">
          A pure dependency cycle exists. No valid tree structure to render. 
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#09090b]" style={{ width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2a2a2f"
          gap={24}
          size={2}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}