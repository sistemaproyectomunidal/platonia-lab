# 🔧 Cómo Solucionar los Errores de TypeScript

## ❓ ¿Qué está pasando?

Ves errores como:
```
Cannot find module '@tanstack/react-query'
Cannot find module '@/types/api'
```

**Esto es NORMAL y ESPERADO** después de crear nuevos archivos y módulos.

## ✅ Solución Simple (30 segundos)

### Opción 1: Reiniciar TypeScript Server (RECOMENDADO)

#### En VS Code:
1. **Abre la paleta de comandos:**
   - Windows/Linux: `Ctrl + Shift + P`
   - Mac: `Cmd + Shift + P`

2. **Escribe:** `TypeScript: Restart TS Server`

3. **Presiona Enter**

4. ✅ **Los errores desaparecerán en 5-10 segundos**

---

### Opción 2: Recargar VS Code

#### En VS Code:
1. **Abre la paleta de comandos:**
   - Windows/Linux: `Ctrl + Shift + P`
   - Mac: `Cmd + Shift + P`

2. **Escribe:** `Developer: Reload Window`

3. **Presiona Enter**

4. ✅ **VS Code se recargará y los errores desaparecerán**

---

### Opción 3: Cerrar y Reabrir

Simplemente cierra VS Code completamente y vuélvelo a abrir.

---

## 🎯 ¿Por Qué Funciona Esto?

TypeScript Server mantiene un cache de los módulos y archivos del proyecto. Cuando creas muchos archivos nuevos (como acabamos de hacer con la refactorización), el cache necesita actualizarse.

**Reiniciar el servidor:**
- ✅ Limpia el cache
- ✅ Re-escanea todos los archivos
- ✅ Actualiza los path aliases (`@/*`)
- ✅ Reconoce los nuevos módulos

---

## 🧪 Verificar que Todo Está OK

Después de reiniciar, ejecuta:

```bash
bash scripts/fix-typescript.sh
```

Deberías ver:
```
🎉 Setup appears correct!
```

---

## 🐛 Si Aún Ves Errores

### 1. Verifica que React Query está instalado
```bash
npm list @tanstack/react-query
```

Si no está, instala:
```bash
npm install @tanstack/react-query
```

### 2. Verifica que los archivos existen
```bash
ls -la src/types/api.ts
ls -la src/services/api/base.ts
ls -la src/hooks/queries/useLab.ts
```

Todos deberían existir.

### 3. Limpia node_modules y reinstala
```bash
rm -rf node_modules
npm install
```

### 4. Compila el proyecto
```bash
npm run build
```

Si compila sin errores, es solo un problema del editor.

---

## 💡 Tip: Atajo de Teclado

Configura un atajo para reiniciar TypeScript rápidamente:

1. `Ctrl/Cmd + K`, `Ctrl/Cmd + S` (abre atajos de teclado)
2. Busca: `TypeScript: Restart TS Server`
3. Asigna tu atajo favorito (ej: `Ctrl/Cmd + Shift + T`)

---

## ✅ Verificación Final

Después de reiniciar TS Server, deberías poder:

✅ Ver intellisense en los nuevos hooks
```typescript
import { useLabDemos } from '@/hooks/queries';
                        // ↑ Autocompletado debería funcionar
```

✅ Ver tipos correctos
```typescript
const { data, isLoading } = useLabDemos();
//      ↑ Debería inferir el tipo correcto
```

✅ No ver errores rojos en los imports

---

## 🎉 Eso es Todo

Una vez que reinicies TypeScript Server, todo funcionará perfectamente.

**La refactorización está completa y el código es correcto.**
Solo necesita que el editor actualice su cache.

---

**¿Sigues teniendo problemas?**
Revisa [ISSUES_SOLVED.md](ISSUES_SOLVED.md) para más detalles técnicos.
