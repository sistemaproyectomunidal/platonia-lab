# Refactorización Fullstack - Platonia Lab

## 📋 Descripción General

Esta refactorización completa reorganiza la arquitectura fullstack del proyecto con:

- **Capa de Servicios** separando lógica de negocio
- **API Clients modulares** por dominio
- **React Query hooks optimizados** con caching y error handling
- **Tipos compartidos** mejorados
- **Backward compatibility** mantenida

## 🏗️ Nueva Arquitectura

### Estructura de Carpetas

```
src/
├── services/
│   └── api/
│       ├── base.ts              # BaseApiClient con métodos comunes
│       ├── lab.service.ts       # Servicio de laboratorio
│       ├── corpus.service.ts    # Servicio de corpus
│       ├── map.service.ts       # Servicio de mapa
│       ├── podcast.service.ts   # Servicio de podcast
│       ├── socratic.service.ts  # Servicio de preguntas socráticas
│       ├── file.service.ts      # Servicio de archivos
│       └── index.ts             # Exports centralizados
│
├── hooks/
│   └── queries/
│       ├── useLab.ts           # Hooks de laboratorio
│       ├── useCorpus.ts        # Hooks de corpus
│       ├── useMap.ts           # Hooks de mapa
│       ├── usePodcast.ts       # Hooks de podcast
│       ├── useSocratic.ts      # Hooks de preguntas
│       ├── useFiles.ts         # Hooks de archivos
│       └── index.ts            # Exports centralizados
│
├── types/
│   └── api.ts                  # Tipos de API
│
└── lib/
    └── backend.ts              # DEPRECATED - mantiene compatibilidad
```

## 🚀 Guía de Migración

### 1. Servicios API

**Antes:**
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('lab_demos')
  .select('*')
  .limit(10);
```

**Ahora:**
```typescript
import { labService } from '@/services/api';

const response = await labService.fetchDemos({ limit: 10 });
if (response.error) {
  // handle error
}
const demos = response.data;
```

### 2. React Query Hooks

**Antes:**
```typescript
import { useLabDemos } from '@/hooks/useBackend';

const { data } = useLabDemos(10);
```

**Ahora:**
```typescript
import { useLabDemos } from '@/hooks/queries';

const { data, isLoading, error } = useLabDemos({ limit: 10 });
```

### 3. Mutations

**Antes:**
```typescript
import { useSaveDemoResult } from '@/hooks/useBackend';

const mutation = useSaveDemoResult();
mutation.mutate(payload);
```

**Ahora:**
```typescript
import { useSaveDemoResult } from '@/hooks/queries';

const mutation = useSaveDemoResult({
  onSuccess: (data) => {
    console.log('Saved:', data);
  }
});
mutation.mutate(payload);
```

## 📚 Servicios Disponibles

### LabService
```typescript
import { labService } from '@/services/api';

// Guardar demo
await labService.saveDemoResult({ prompt, summary, axes, matchedNodes, questions });

// Obtener demos
await labService.fetchDemos({ limit: 10, offset: 0 });

// Obtener demo por ID
await labService.getDemoById(id);

// Eliminar demo
await labService.deleteDemo(id);

// Generar respuesta con IA
await labService.generateAIResponse({ prompt, context, systemPrompt });
```

### CorpusService
```typescript
import { corpusService } from '@/services/api';

// Obtener entradas
await corpusService.fetchEntries({ status: 'published', limit: 50 });

// Obtener por slug
await corpusService.getEntryBySlug(slug);

// Crear entrada
await corpusService.createEntry({ title, content, slug, status });

// Actualizar entrada
await corpusService.updateEntry(id, updates);

// Buscar
await corpusService.searchEntries(query);
```

### MapService
```typescript
import { mapService } from '@/services/api';

// Obtener nodos
await mapService.fetchNodes();

// Obtener por eje
await mapService.getNodesByAxis('L1_miedo');

// Crear nodo
await mapService.createNode({ id, label, axis, description });

// Actualizar posición
await mapService.updateNodePosition(id, x, y);

// Actualización por lotes
await mapService.batchUpdateNodePositions([{ id, x, y }]);
```

### PodcastService
```typescript
import { podcastService } from '@/services/api';

// Obtener episodios
await podcastService.fetchEpisodes({ includeUnpublished: false });

// Obtener por número
await podcastService.getEpisodeByNumber(1);

// Crear episodio
await podcastService.createEpisode({ title, episode_number, description });

// Publicar/despublicar
await podcastService.togglePublish(id, true);

// Buscar
await podcastService.searchEpisodes(query);
```

### SocraticService
```typescript
import { socraticService } from '@/services/api';

// Obtener preguntas
await socraticService.fetchQuestions({ axis: 'L1_miedo', limit: 10 });

// Obtener aleatorias
await socraticService.getRandomQuestions(3, 'L1_miedo');

// Crear pregunta
await socraticService.createQuestion({ text, axis, tension, level });
```

### FileService
```typescript
import { fileService } from '@/services/api';

// Subir archivo
await fileService.uploadFile(file);

// Listar subidas
await fileService.listFileUploads({ limit: 50 });

// Eliminar
await fileService.deleteFileUpload(id);
```

## 🎣 Hooks Disponibles

### Lab Hooks
```typescript
import { 
  useLabDemos,           // Listar demos
  useLabDemo,            // Un demo por ID
  useSaveDemoResult,     // Guardar demo
  useDeleteLabDemo,      // Eliminar demo
  useGenerateAI,         // Generar con IA
} from '@/hooks/queries';
```

### Corpus Hooks
```typescript
import {
  useCorpusEntries,           // Listar entradas
  useCorpusEntry,             // Una entrada por ID
  useCorpusEntryBySlug,       // Una entrada por slug
  useCreateCorpusEntry,       // Crear entrada
  useUpdateCorpusEntry,       // Actualizar entrada
  useDeleteCorpusEntry,       // Eliminar entrada
  useSearchCorpus,            // Buscar
} from '@/hooks/queries';
```

### Map Hooks
```typescript
import {
  useMapNodes,                 // Todos los nodos
  useMapNode,                  // Un nodo
  useMapNodesByAxis,           // Nodos por eje
  useCreateNode,               // Crear nodo
  useUpdateNode,               // Actualizar nodo
  useUpdateNodePosition,       // Actualizar posición
  useBatchUpdateNodePositions, // Actualización por lotes
  useDeleteNode,               // Eliminar nodo
} from '@/hooks/queries';
```

### Podcast Hooks
```typescript
import {
  usePodcastEpisodes,          // Listar episodios
  usePodcastEpisode,           // Un episodio por ID
  usePodcastEpisodeByNumber,   // Un episodio por número
  useCreateEpisode,            // Crear episodio
  useUpdateEpisode,            // Actualizar episodio
  useDeleteEpisode,            // Eliminar episodio
  useToggleEpisodePublish,     // Publicar/despublicar
  useSearchEpisodes,           // Buscar
} from '@/hooks/queries';
```

### Socratic Hooks
```typescript
import {
  useSocraticQuestions,        // Listar preguntas
  useSocraticQuestion,         // Una pregunta
  useSocraticQuestionsByAxis,  // Preguntas por eje
  useRandomSocraticQuestions,  // Preguntas aleatorias
  useCreateSocraticQuestion,   // Crear pregunta
  useUpdateSocraticQuestion,   // Actualizar pregunta
  useDeleteSocraticQuestion,   // Eliminar pregunta
} from '@/hooks/queries';
```

### File Hooks
```typescript
import {
  useFileUpload,          // Subir archivo
  useFileUploadById,      // Obtener subida por ID
  useFileUploads,         // Listar subidas
  useDeleteFileUpload,    // Eliminar subida
} from '@/hooks/queries';
```

## ✨ Características

### 1. Caching Inteligente
Los hooks de React Query incluyen configuración de `staleTime` y `gcTime` optimizada:
- Datos poco cambiantes (nodos, corpus): 10-15 minutos
- Datos dinámicos (demos, búsquedas): 2-5 minutos

### 2. Invalidación Automática
Las mutaciones invalidan automáticamente las queries relacionadas:
```typescript
const mutation = useSaveDemoResult({
  onSuccess: () => {
    // Automáticamente invalida y recarga la lista de demos
  }
});
```

### 3. Error Handling Consistente
Todos los servicios retornan `ApiResponse<T>`:
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

### 4. TypeScript First
Tipos completos para todas las operaciones con intellisense completo.

### 5. Query Keys Organizadas
Query keys jerárquicas para invalidación precisa:
```typescript
labKeys.all                    // ['lab']
labKeys.demos()                // ['lab', 'demos']
labKeys.demosList(options)     // ['lab', 'demos', 'list', options]
labKeys.demo(id)               // ['lab', 'demos', 'detail', id]
```

## 🔄 Backward Compatibility

Los archivos antiguos están marcados como `@deprecated` pero siguen funcionando:

- `src/lib/backend.ts` - Delegado a los nuevos servicios
- `src/hooks/useBackend.ts` - Delegado a los nuevos hooks

Esto permite una migración gradual sin romper código existente.

## 📊 Ejemplo Completo

```typescript
import { useLabDemos, useSaveDemoResult, useGenerateAI } from '@/hooks/queries';

function MyComponent() {
  // Query con caching automático
  const { data: demos, isLoading, error } = useLabDemos({ 
    limit: 10,
    orderBy: 'created_at',
    ascending: false 
  });

  // Mutation con invalidación automática
  const saveMutation = useSaveDemoResult({
    onSuccess: (data) => {
      console.log('Demo guardado:', data.data?.id);
    },
    onError: (error) => {
      console.error('Error:', error.message);
    }
  });

  // Generar con IA
  const aiMutation = useGenerateAI({
    onSuccess: (data) => {
      console.log('Respuesta IA:', data.data?.text);
    }
  });

  const handleSave = () => {
    saveMutation.mutate({
      prompt: 'Mi análisis',
      summary: 'Resumen',
      axes: ['L1_miedo'],
      matchedNodes: ['node1'],
      questions: []
    });
  };

  const handleGenerate = () => {
    aiMutation.mutate({
      prompt: '¿Qué es el miedo?',
      context: 'Análisis filosófico'
    });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleSave}>Guardar Demo</button>
      <button onClick={handleGenerate}>Generar con IA</button>
      {demos?.map(demo => (
        <div key={demo.id}>{demo.prompt}</div>
      ))}
    </div>
  );
}
```

## 🎯 Próximos Pasos

1. **Migrar componentes existentes** gradualmente a los nuevos hooks
2. **Añadir tests** para servicios y hooks
3. **Implementar optimistic updates** donde sea necesario
4. **Añadir infinite queries** para paginación
5. **Configurar React Query Devtools** para debugging

## 📖 Referencias

- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Client Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
