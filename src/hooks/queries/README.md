# React Query Hooks

Esta carpeta contiene todos los hooks optimizados con React Query para gestionar estado del servidor, caching y sincronización.

## 🎯 Filosofía

Los hooks están diseñados para:
- **Caching automático** - Reduce llamadas innecesarias
- **Loading states** - Estados de carga listos para usar
- **Error handling** - Manejo de errores consistente
- **Invalidación inteligente** - Actualización automática después de mutaciones
- **TypeScript completo** - Type safety en todas partes

## 📦 Hooks Disponibles

### Lab Hooks (`useLab.ts`)

#### Queries
```typescript
// Fetch demos con paginación
const { data, isLoading, error } = useLabDemos({ 
  limit: 10,
  offset: 0,
  orderBy: 'created_at',
  ascending: false 
});

// Get demo específico
const { data: demo } = useLabDemo(demoId);
```

#### Mutations
```typescript
// Guardar demo
const saveMutation = useSaveDemoResult({
  onSuccess: (response) => {
    toast.success(`Guardado: ${response.data?.id}`);
  }
});
saveMutation.mutate(payload);

// Eliminar demo
const deleteMutation = useDeleteLabDemo();
deleteMutation.mutate(demoId);

// Generar con IA
const aiMutation = useGenerateAI();
aiMutation.mutate({ prompt, context });
```

### Corpus Hooks (`useCorpus.ts`)

#### Queries
```typescript
// Fetch entradas
const { data } = useCorpusEntries({ 
  status: 'published',
  limit: 50 
});

// Por slug
const { data } = useCorpusEntryBySlug('miedo-al-miedo');

// Por ID
const { data } = useCorpusEntry(id);

// Buscar
const { data } = useSearchCorpus(query);
```

#### Mutations
```typescript
// Crear
const createMutation = useCreateCorpusEntry();
createMutation.mutate(newEntry);

// Actualizar
const updateMutation = useUpdateCorpusEntry();
updateMutation.mutate({ id, updates });

// Eliminar
const deleteMutation = useDeleteCorpusEntry();
deleteMutation.mutate(id);
```

### Map Hooks (`useMap.ts`)

#### Queries
```typescript
// Todos los nodos
const { data: nodes } = useMapNodes();

// Un nodo
const { data: node } = useMapNode(nodeId);

// Por eje
const { data: l1Nodes } = useMapNodesByAxis('L1_miedo');
```

#### Mutations
```typescript
// Crear nodo
const createMutation = useCreateNode();
createMutation.mutate({ id, label, axis, description });

// Actualizar nodo
const updateMutation = useUpdateNode();
updateMutation.mutate({ id, updates });

// Actualizar posición
const positionMutation = useUpdateNodePosition();
positionMutation.mutate({ id, x, y });

// Actualización masiva
const batchMutation = useBatchUpdateNodePositions();
batchMutation.mutate([
  { id: 'node1', x: 100, y: 200 },
  { id: 'node2', x: 300, y: 400 }
]);

// Eliminar
const deleteMutation = useDeleteNode();
deleteMutation.mutate(id);
```

### Podcast Hooks (`usePodcast.ts`)

#### Queries
```typescript
// Todos los episodios
const { data } = usePodcastEpisodes();

// Con opciones
const { data } = usePodcastEpisodes({ 
  includeUnpublished: false,
  limit: 20 
});

// Por ID
const { data } = usePodcastEpisode(episodeId);

// Por número
const { data } = usePodcastEpisodeByNumber(1);

// Buscar
const { data } = useSearchEpisodes('miedo');
```

#### Mutations
```typescript
// Crear
const createMutation = useCreateEpisode();
createMutation.mutate(episode);

// Actualizar
const updateMutation = useUpdateEpisode();
updateMutation.mutate({ id, updates });

// Eliminar
const deleteMutation = useDeleteEpisode();
deleteMutation.mutate(id);

// Publicar/despublicar
const toggleMutation = useToggleEpisodePublish();
toggleMutation.mutate({ id, isPublished: true });
```

### Socratic Hooks (`useSocratic.ts`)

#### Queries
```typescript
// Todas las preguntas
const { data } = useSocraticQuestions({ limit: 20 });

// Por eje
const { data } = useSocraticQuestionsByAxis('L1_miedo');

// Aleatorias
const { data } = useRandomSocraticQuestions(3, 'L1_miedo');

// Una pregunta
const { data } = useSocraticQuestion(questionId);
```

#### Mutations
```typescript
// Crear
const createMutation = useCreateSocraticQuestion();
createMutation.mutate({ text, axis, tension });

// Actualizar
const updateMutation = useUpdateSocraticQuestion();
updateMutation.mutate({ id, updates });

// Eliminar
const deleteMutation = useDeleteSocraticQuestion();
deleteMutation.mutate(id);
```

### File Hooks (`useFiles.ts`)

#### Queries
```typescript
// Listar subidas
const { data } = useFileUploads({ limit: 50 });

// Por ID
const { data } = useFileUploadById(uploadId);
```

#### Mutations
```typescript
// Subir archivo
const uploadMutation = useFileUpload({
  onSuccess: (response) => {
    console.log('Uploaded:', response.data);
  }
});
uploadMutation.mutate(file);

// Eliminar
const deleteMutation = useDeleteFileUpload();
deleteMutation.mutate(uploadId);
```

## 🎨 Patrones de Uso

### 1. Query Básico
```typescript
function MyComponent() {
  const { data, isLoading, error, refetch } = useLabDemos({ limit: 10 });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(demo => <div key={demo.id}>{demo.prompt}</div>)}
      <button onClick={() => refetch()}>Recargar</button>
    </div>
  );
}
```

### 2. Mutation con Callbacks
```typescript
function MyComponent() {
  const mutation = useSaveDemoResult({
    onSuccess: (response) => {
      toast.success('Guardado!');
      // Automáticamente invalida queries relacionadas
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSave = () => {
    mutation.mutate({
      prompt: 'Mi análisis',
      summary: 'Resumen',
      axes: ['L1_miedo'],
      matchedNodes: [],
      questions: []
    });
  };

  return (
    <button 
      onClick={handleSave}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Guardando...' : 'Guardar'}
    </button>
  );
}
```

### 3. Conditional Queries
```typescript
function MyComponent({ demoId }: { demoId?: string }) {
  // Solo ejecuta si demoId está definido
  const { data } = useLabDemo(demoId, {
    enabled: !!demoId
  });

  return <div>{data?.prompt}</div>;
}
```

### 4. Dependent Queries
```typescript
function MyComponent() {
  const { data: corpus } = useCorpusEntries();
  
  // Se ejecuta después de que corpus esté disponible
  const firstSlug = corpus?.[0]?.slug;
  const { data: entry } = useCorpusEntryBySlug(firstSlug, {
    enabled: !!firstSlug
  });

  return <div>{entry?.title}</div>;
}
```

### 5. Manual Invalidation
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { labKeys } from '@/hooks/queries';

function MyComponent() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalida todas las queries de lab
    queryClient.invalidateQueries({ queryKey: labKeys.all });
    
    // O solo las demos
    queryClient.invalidateQueries({ queryKey: labKeys.demos() });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

### 6. Optimistic Updates
```typescript
const mutation = useSaveDemoResult({
  onMutate: async (newDemo) => {
    // Cancel in-flight queries
    await queryClient.cancelQueries({ queryKey: labKeys.demos() });
    
    // Snapshot
    const previousDemos = queryClient.getQueryData(labKeys.demos());
    
    // Optimistically update
    queryClient.setQueryData(labKeys.demos(), (old: any) => 
      [newDemo, ...old]
    );
    
    return { previousDemos };
  },
  onError: (err, newDemo, context) => {
    // Rollback on error
    queryClient.setQueryData(labKeys.demos(), context.previousDemos);
  },
  onSettled: () => {
    // Always refetch
    queryClient.invalidateQueries({ queryKey: labKeys.demos() });
  }
});
```

## 🔑 Query Keys

Cada hook usa query keys jerárquicas:

```typescript
// Lab
labKeys.all                    // ['lab']
labKeys.demos()                // ['lab', 'demos']
labKeys.demosList(options)     // ['lab', 'demos', 'list', options]
labKeys.demo(id)               // ['lab', 'demos', 'detail', id]

// Corpus
corpusKeys.all                 // ['corpus']
corpusKeys.entries()           // ['corpus', 'entries']
corpusKeys.entriesList(opts)   // ['corpus', 'entries', 'list', opts]
corpusKeys.entry(id)           // ['corpus', 'entries', 'detail', id]
corpusKeys.entryBySlug(slug)   // ['corpus', 'entries', 'slug', slug]

// Map
mapKeys.all                    // ['map']
mapKeys.nodes()                // ['map', 'nodes']
mapKeys.nodesList()            // ['map', 'nodes', 'list']
mapKeys.node(id)               // ['map', 'nodes', 'detail', id]

// ... y así sucesivamente
```

## ⚙️ Configuración

### Stale Time
Tiempo que los datos se consideran "frescos":

- **Lab demos**: 5 minutos
- **Corpus**: 10 minutos
- **Map nodes**: 15 minutos
- **Podcast**: 10 minutos
- **Socratic**: 10 minutos (5 min para random)
- **Files**: 5 minutos

### GC Time
Tiempo que los datos inactivos permanecen en cache:

- **Default**: 10-30 minutos dependiendo del tipo

### Refetch Behavior
- **On window focus**: Enabled
- **On reconnect**: Enabled
- **On mount**: Enabled si stale
- **Retry**: 3 intentos con backoff exponencial

## 🧪 Testing

Los hooks se pueden testear con `@testing-library/react-hooks`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLabDemos } from '@/hooks/queries';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useLabDemos fetches data', async () => {
  const { result } = renderHook(() => useLabDemos(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## 📚 Recursos

- [React Query Docs](https://tanstack.com/query/latest)
- [Guía de Refactorización](../../REFACTORING_GUIDE.md)
- [Servicios API](../services/api/README.md)
- [Ejemplos](../examples/)

## ✨ Mejores Prácticas

1. **Usar enabled**: Para queries condicionales
2. **Manejar loading y error**: Siempre mostrar estados
3. **Usar callbacks**: onSuccess, onError en mutations
4. **No abusar de refetch**: React Query ya refetches automáticamente
5. **Aprovechar cache**: No hacer fetches innecesarios
6. **Tipos correctos**: TypeScript inferirá tipos automáticamente

## 🚫 Anti-Patrones

❌ **No hacer fetch manual en useEffect**
```typescript
// Mal
useEffect(() => {
  fetchData().then(setData);
}, []);

// Bien
const { data } = useLabDemos();
```

❌ **No usar useState para datos del servidor**
```typescript
// Mal
const [demos, setDemos] = useState([]);
useEffect(() => {
  fetchDemos().then(setDemos);
}, []);

// Bien
const { data: demos } = useLabDemos();
```

❌ **No refetch en cada render**
```typescript
// Mal
useEffect(() => {
  refetch();
}); // Sin dependencias = cada render

// Bien
// React Query ya maneja refetch automáticamente
```

---

**Hooks diseñados para hacer el data fetching simple y eficiente**
