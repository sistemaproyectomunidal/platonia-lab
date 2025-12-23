/**
 * Example: Using the new Lab API Services and Hooks
 */

import React, { useState } from "react";
import {
  useLabDemos,
  useSaveDemoResult,
  useGenerateAI,
  useDeleteLabDemo,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LabDemoExample() {
  const [prompt, setPrompt] = useState("");

  // Query - fetch lab demos with automatic caching
  const {
    data: demos,
    isLoading,
    error,
    refetch,
  } = useLabDemos({
    limit: 10,
    orderBy: "created_at",
    ascending: false,
  });

  // Mutation - save demo result
  const saveMutation = useSaveDemoResult({
    onSuccess: (response) => {
      toast.success(`Demo guardado con ID: ${response.data?.id}`);
      // Automatically invalidates and refetches the demos list
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  // Mutation - generate AI response
  const aiMutation = useGenerateAI({
    onSuccess: (response) => {
      if (response.data?.text) {
        toast.success("Respuesta generada");
        console.log("AI Response:", response.data.text);
      }
    },
    onError: (error) => {
      toast.error(`Error de IA: ${error.message}`);
    },
  });

  // Mutation - delete demo
  const deleteMutation = useDeleteLabDemo();

  const handleSave = async () => {
    if (!prompt.trim()) {
      toast.error("Ingresa un prompt");
      return;
    }

    saveMutation.mutate({
      prompt,
      summary: "Resumen generado automáticamente",
      axes: ["L1_miedo", "L2_control"],
      matchedNodes: ["node1", "node2"],
      questions: [
        { text: "¿Qué es el miedo?", axis: "L1_miedo" },
        { text: "¿Cómo se relaciona con el control?", axis: "L2_control" },
      ],
      aiResponse: "Respuesta de IA aquí...",
    });
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Ingresa un prompt");
      return;
    }

    aiMutation.mutate({
      prompt,
      context: "Análisis filosófico del miedo y control",
      systemPrompt:
        "Eres un asistente filosófico experto en análisis conceptual.",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este demo?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Demo eliminado");
        },
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Cargando demos...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error.message}
        <Button onClick={() => refetch()} className="ml-2">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Laboratorio de Análisis</h2>

        {/* Input Section */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ingresa tu análisis..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={aiMutation.isPending}
            variant="secondary"
          >
            {aiMutation.isPending ? "Generando..." : "Generar IA"}
          </Button>
        </div>

        {/* AI Response */}
        {aiMutation.data?.data?.text && (
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-semibold mb-2">Respuesta de IA:</h3>
            <p className="whitespace-pre-wrap">{aiMutation.data.data.text}</p>
          </div>
        )}
      </div>

      {/* Demos List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Demos Guardados ({demos?.length || 0})
        </h3>

        {demos && demos.length > 0 ? (
          <div className="space-y-2">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{demo.prompt}</p>
                    <p className="text-sm text-gray-600 mt-1">{demo.summary}</p>
                    <div className="flex gap-2 mt-2">
                      {demo.axes?.map((axis) => (
                        <span
                          key={axis}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {axis}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDelete(demo.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay demos guardados</p>
        )}
      </div>
    </div>
  );
}
