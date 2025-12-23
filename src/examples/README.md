# 📚 Ejemplos de Código

Este directorio contiene ejemplos de referencia sobre cómo usar los nuevos servicios y hooks. Estos archivos **no se compilan** con el proyecto principal, son solo para referencia y documentación.

## ⚠️ Nota Importante

Los archivos en esta carpeta están excluidos de la compilación TypeScript (`tsconfig.app.json`) para evitar dependencias innecesarias. Son ejemplos de referencia que puedes:

1. **Leer** para entender patrones de uso
2. **Copiar** y adaptar a tus componentes
3. **Usar como plantilla** para crear nuevos componentes

## 📄 Archivos Disponibles

### LabDemoExample.tsx
Ejemplo completo de cómo usar los hooks de laboratorio:
- `useLabDemos` - Listar demos con caching
- `useSaveDemoResult` - Guardar demos con callbacks
- `useGenerateAI` - Generar respuestas con IA
- `useDeleteLabDemo` - Eliminar demos

### MapExample.tsx
Ejemplo de gestión del mapa conceptual:
- `useMapNodes` - Todos los nodos
- `useMapNodesByAxis` - Filtrar por eje
- `useCreateNode` - Crear nodos
- `useUpdateNodePosition` - Actualizar posiciones
- `useDeleteNode` - Eliminar nodos

### DirectServiceUsage.ts
Ejemplo de uso directo de servicios (sin React):
- Útil para scripts, utilities, funciones del servidor
- Muestra todos los servicios disponibles
- Ejemplos de cada operación CRUD

### FileUploaderMigrated.tsx
Ejemplo de migración de componente existente:
- Cómo migrar de `useBackend` a `useFileUpload`
- Comparación antes/después
- Mejores prácticas

## 🚀 Cómo Usar Estos Ejemplos

### Opción 1: Copiar y Adaptar
```bash
# Copiar a tu proyecto
cp src/examples/LabDemoExample.tsx src/components/MyLabComponent.tsx

# Editar y adaptar a tus necesidades
```

### Opción 2: Leer y Replicar
Abre los archivos, lee el código y replica los patrones en tus propios componentes.

### Opción 3: Ejecutar (requiere setup)
Si quieres ejecutar estos ejemplos:

1. Muévelos fuera de `src/examples/`
2. Importa en tu App.tsx
3. Usa en tu router

## 📖 Documentación Relacionada

- [Guía de Refactorización](../../REFACTORING_GUIDE.md)
- [Arquitectura](../../ARCHITECTURE.md)
- [Servicios API](../services/api/README.md)
- [React Query Hooks](../hooks/queries/README.md)

## 💡 Patrones Comunes

### Pattern 1: Query con Loading
```typescript
const { data, isLoading, error } = useLabDemos({ limit: 10 });

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;

return <div>{data.map(...)}</div>;
```

### Pattern 2: Mutation con Callbacks
```typescript
const mutation = useSaveDemoResult({
  onSuccess: (response) => {
    toast.success('Guardado!');
  },
  onError: (error) => {
    toast.error(error.message);
  }
});

<button onClick={() => mutation.mutate(data)}>
  {mutation.isPending ? 'Guardando...' : 'Guardar'}
</button>
```

### Pattern 3: Conditional Query
```typescript
const { data } = useLabDemo(id, {
  enabled: !!id // Solo ejecuta si id existe
});
```

### Pattern 4: Refetch Manual
```typescript
const { data, refetch } = useLabDemos();

<button onClick={() => refetch()}>Recargar</button>
```

## 🎯 Ejemplos Rápidos por Caso de Uso

### Necesito: Listar datos con paginación
👉 Ver: `LabDemoExample.tsx` - useLabDemos con opciones

### Necesito: Crear/Actualizar/Eliminar
👉 Ver: `MapExample.tsx` - CRUD completo con nodos

### Necesito: Usar servicios fuera de React
👉 Ver: `DirectServiceUsage.ts` - Todas las operaciones

### Necesito: Migrar componente existente
👉 Ver: `FileUploaderMigrated.tsx` - Comparación antes/después

### Necesito: Buscar datos
👉 Ver patrones de `useSearchCorpus` o `useSearchEpisodes`

### Necesito: Datos aleatorios
👉 Ver `useRandomSocraticQuestions` en hooks

## ✅ Checklist de Migración

Cuando migres un componente existente:

- [ ] Reemplazar imports de `@/hooks/useBackend`
- [ ] Cambiar a `@/hooks/queries`
- [ ] Actualizar nombres de hooks (ver guía)
- [ ] Añadir manejo de `isLoading`
- [ ] Añadir manejo de `error`
- [ ] Usar callbacks en mutations
- [ ] Aprovechar invalidación automática
- [ ] Verificar tipos TypeScript

## 🐛 Troubleshooting

**P: ¿Por qué estos archivos no se compilan?**
R: Están excluidos intencionalmente para no añadir dependencias al build principal. Son solo referencia.

**P: ¿Puedo usarlos en mi proyecto?**
R: Sí, cópialos fuera de `src/examples/` y adáptalos a tus necesidades.

**P: ¿Hay más ejemplos?**
R: Revisa la documentación en `REFACTORING_GUIDE.md` y los READMEs de servicios y hooks.

---

**Estos ejemplos son código vivo que muestra las mejores prácticas de la nueva arquitectura**
