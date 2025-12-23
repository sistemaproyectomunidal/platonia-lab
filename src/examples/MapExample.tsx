// @ts-nocheck
/**
 * Example: Using Map Service and Hooks
 */

import React, { useState } from 'react';
import { 
  useMapNodes, 
  useMapNodesByAxis,
  useCreateNode,
  useUpdateNodePosition,
  useDeleteNode 
} from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Node } from '@/types';

export function MapExample() {
  const [selectedAxis, setSelectedAxis] = useState<string>('L1_miedo');

  // Query - fetch all nodes
  const { 
    data: allNodes, 
    isLoading: loadingAll,
    error: errorAll 
  } = useMapNodes();

  // Query - fetch nodes by axis
  const { 
    data: axisNodes, 
    isLoading: loadingAxis 
  } = useMapNodesByAxis(selectedAxis);

  // Mutation - create node
  const createMutation = useCreateNode({
    onSuccess: () => {
      toast.success('Nodo creado');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  // Mutation - update position
  const updatePositionMutation = useUpdateNodePosition();

  // Mutation - delete node
  const deleteMutation = useDeleteNode();

  const handleCreateNode = () => {
    const newNode = {
      id: `node_${Date.now()}`,
      label: 'Nuevo Nodo',
      axis: selectedAxis,
      description: 'Descripción del nodo',
      position_x: Math.random() * 500,
      position_y: Math.random() * 500,
    };

    createMutation.mutate(newNode);
  };

  const handleUpdatePosition = (node: Node) => {
    const newX = (node.position_x || 0) + 50;
    const newY = (node.position_y || 0) + 50;

    updatePositionMutation.mutate(
      { id: node.id, x: newX, y: newY },
      {
        onSuccess: () => {
          toast.success('Posición actualizada');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este nodo?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Nodo eliminado');
        }
      });
    }
  };

  if (loadingAll) {
    return <div className="p-4">Cargando nodos...</div>;
  }

  if (errorAll) {
    return <div className="p-4 text-red-600">Error: {errorAll.message}</div>;
  }

  const axes = ['L1_miedo', 'L2_control', 'L3_legitimidad', 'L4_salud_mental', 'L5_responsabilidad'];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mapa de Nodos</h2>
        
        {/* Axis Selector */}
        <div className="flex gap-2">
          <select
            value={selectedAxis}
            onChange={(e) => setSelectedAxis(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            {axes.map((axis) => (
              <option key={axis} value={axis}>
                {axis}
              </option>
            ))}
          </select>
          <Button onClick={handleCreateNode} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creando...' : 'Crear Nodo'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Total de Nodos</p>
            <p className="text-2xl font-bold">{allNodes?.length || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Nodos en {selectedAxis}</p>
            <p className="text-2xl font-bold">{axisNodes?.length || 0}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">Ejes Disponibles</p>
            <p className="text-2xl font-bold">{axes.length}</p>
          </div>
        </div>
      </div>

      {/* Nodes by Axis */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Nodos en {selectedAxis} {loadingAxis && '(cargando...)'}
        </h3>
        
        {axisNodes && axisNodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {axisNodes.map((node) => (
              <div 
                key={node.id} 
                className="p-4 border rounded hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{node.label}</h4>
                  <Button
                    onClick={() => handleDelete(node.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    ×
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {node.description || 'Sin descripción'}
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Posición: ({node.position_x?.toFixed(0) || 0}, {node.position_y?.toFixed(0) || 0})
                  </span>
                  <Button
                    onClick={() => handleUpdatePosition(node)}
                    disabled={updatePositionMutation.isPending}
                    size="sm"
                    variant="outline"
                  >
                    Mover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay nodos en este eje</p>
        )}
      </div>

      {/* All Nodes Summary */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Distribución por Eje</h3>
        <div className="space-y-1">
          {axes.map((axis) => {
            const count = allNodes?.filter((n) => n.axis === axis).length || 0;
            return (
              <div key={axis} className="flex items-center gap-2">
                <span className="w-40 text-sm">{axis}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(count / (allNodes?.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
