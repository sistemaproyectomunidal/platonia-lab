# API Services

Esta carpeta contiene todos los servicios de API organizados por dominio. Cada servicio encapsula la lógica de negocio y las llamadas a Supabase.

## 🎯 Filosofía

Los servicios son:
- **Independientes de React** - Pueden usarse en cualquier contexto
- **Type-safe** - TypeScript completo
- **Consistentes** - Todos retornan `ApiResponse<T>`
- **Singleton** - Una instancia compartida por servicio
- **Testeables** - Fácil de mockear y testear

## 📦 Servicios Disponibles

### BaseApiClient (`base.ts`)
Clase base con funcionalidad común para todos los servicios.

**Métodos protegidos:**
- `handleResponse<T>()` - Maneja respuestas de Supabase
- `invokeFunction<T>()` - Invoca Edge Functions
- `getSupabaseClient()` - Acceso al cliente de Supabase

### LabService (`lab.service.ts`)
Gestiona operaciones del laboratorio de análisis.

**Métodos:**
- `saveDemoResult()` - Guarda resultado de análisis
- `fetchDemos()` - Lista demos con paginación
- `getDemoById()` - Obtiene demo por ID
- `deleteDemo()` - Elimina demo
- `generateAIResponse()` - Genera respuesta con OpenAI

**Ejemplo:**
```typescript
import { labService } from '@/services/api';

const response = await labService.fetchDemos({ limit: 10 });
if (response.data) {
  console.log(response.data);
}
```

### CorpusService (`corpus.service.ts`)
Gestiona entradas del corpus filosófico.

**Métodos:**
- `fetchEntries()` - Lista entradas
- `getEntryBySlug()` - Obtiene por slug
- `getEntryById()` - Obtiene por ID
- `createEntry()` - Crea entrada
- `updateEntry()` - Actualiza entrada
- `deleteEntry()` - Elimina entrada
- `searchEntries()` - Busca en entradas

**Ejemplo:**
```typescript
import { corpusService } from '@/services/api';

const response = await corpusService.searchEntries('miedo');
if (response.data) {
  console.log(`Found ${response.data.length} entries`);
}
```

### MapService (`map.service.ts`)
Gestiona nodos y relaciones del mapa conceptual.

**Métodos:**
- `fetchNodes()` - Todos los nodos
- `getNodeById()` - Nodo por ID
- `getNodesByAxis()` - Nodos por eje
- `createNode()` - Crea nodo
- `updateNode()` - Actualiza nodo
- `deleteNode()` - Elimina nodo
- `updateNodePosition()` - Actualiza posición
- `batchUpdateNodePositions()` - Actualización masiva

**Ejemplo:**
```typescript
import { mapService } from '@/services/api';

const response = await mapService.getNodesByAxis('L1_miedo');
if (response.data) {
  console.log(`${response.data.length} nodes in L1_miedo`);
}
```

### PodcastService (`podcast.service.ts`)
Gestiona episodios del podcast.

**Métodos:**
- `fetchEpisodes()` - Lista episodios
- `getEpisodeById()` - Episodio por ID
- `getEpisodeByNumber()` - Episodio por número
- `createEpisode()` - Crea episodio
- `updateEpisode()` - Actualiza episodio
- `deleteEpisode()` - Elimina episodio
- `togglePublish()` - Publica/despublica
- `searchEpisodes()` - Busca episodios

**Ejemplo:**
```typescript
import { podcastService } from '@/services/api';

const response = await podcastService.getEpisodeByNumber(1);
if (response.data) {
  console.log(`Episode 1: ${response.data.title}`);
}
```

### SocraticService (`socratic.service.ts`)
Gestiona preguntas socráticas.

**Métodos:**
- `fetchQuestions()` - Lista preguntas
- `getQuestionById()` - Pregunta por ID
- `getQuestionsByAxis()` - Preguntas por eje
- `createQuestion()` - Crea pregunta
- `updateQuestion()` - Actualiza pregunta
- `deleteQuestion()` - Elimina pregunta
- `getRandomQuestions()` - Preguntas aleatorias

**Ejemplo:**
```typescript
import { socraticService } from '@/services/api';

const response = await socraticService.getRandomQuestions(3, 'L1_miedo');
if (response.data) {
  response.data.forEach(q => console.log(q.text));
}
```

### FileService (`file.service.ts`)
Gestiona subida y gestión de archivos.

**Métodos:**
- `uploadFile()` - Sube archivo
- `getFileUploadById()` - Obtiene subida por ID
- `listFileUploads()` - Lista subidas
- `deleteFileUpload()` - Elimina registro

**Ejemplo:**
```typescript
import { fileService } from '@/services/api';

const file = new File(['content'], 'test.txt');
const response = await fileService.uploadFile(file);
if (response.data) {
  console.log(`Uploaded: ${response.data.filename}`);
}
```

## 🔧 Uso

### En Componentes React
```typescript
// ❌ NO usar servicios directamente en componentes
const response = await labService.fetchDemos();

// ✅ Usar hooks de React Query
import { useLabDemos } from '@/hooks/queries';
const { data } = useLabDemos();
```

### En Utilities, Scripts, Servidor
```typescript
// ✅ Usar servicios directamente
import { labService } from '@/services/api';

async function processData() {
  const response = await labService.fetchDemos({ limit: 100 });
  // process data...
}
```

## 📝 Tipos Comunes

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

Todos los métodos retornan este tipo:
```typescript
const response = await labService.fetchDemos();

if (response.error) {
  console.error('Error:', response.error);
  return;
}

if (response.data) {
  console.log('Data:', response.data);
}
```

### ApiError
```typescript
class ApiError extends Error {
  statusCode?: number;
  originalError?: unknown;
}
```

## 🧪 Testing

Los servicios son fáciles de testear:

```typescript
import { labService } from '@/services/api';

// Mock Supabase
jest.mock('@/integrations/supabase/client');

describe('LabService', () => {
  it('should fetch demos', async () => {
    const response = await labService.fetchDemos({ limit: 5 });
    expect(response.data).toBeDefined();
    expect(response.data?.length).toBeLessThanOrEqual(5);
  });
});
```

## 🔒 Error Handling

Todos los servicios tienen error handling consistente:

```typescript
try {
  const response = await labService.fetchDemos();
  
  if (response.error) {
    // Handle business logic error
    console.error('API Error:', response.error);
    return;
  }
  
  // Success case
  const demos = response.data;
  
} catch (e) {
  // Handle unexpected exceptions
  console.error('Unexpected error:', e);
}
```

## 📚 Recursos

- [Guía de Refactorización](../../REFACTORING_GUIDE.md)
- [Arquitectura](../../ARCHITECTURE.md)
- [Ejemplos](../examples/)
- [Hooks de React Query](../hooks/queries/)

## ✨ Mejores Prácticas

1. **Usar servicios fuera de React**: Scripts, utilities, servidor
2. **Usar hooks en React**: Components, pages
3. **Manejar errores**: Siempre verificar `response.error`
4. **TypeScript**: Aprovechar los tipos para intellisense
5. **No modificar servicios**: Extender si necesitas funcionalidad nueva

## 🚀 Extender Servicios

Para añadir un nuevo servicio:

1. Crear archivo `src/services/api/my-service.service.ts`
2. Extender `BaseApiClient`
3. Implementar métodos
4. Exportar instancia singleton
5. Añadir a `index.ts`

```typescript
// my-service.service.ts
import { BaseApiClient, ApiResponse } from './base';

export class MyService extends BaseApiClient {
  async getData(): Promise<ApiResponse<any>> {
    const supabase = this.getSupabaseClient();
    return this.handleResponse(
      supabase.from('my_table').select('*')
    );
  }
}

export const myService = new MyService();
```

```typescript
// index.ts
export * from './my-service.service';
export { myService } from './my-service.service';
```

---

**Servicios diseñados para ser simples, consistentes y fáciles de usar**
