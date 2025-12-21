// Corpus index - metadata for all corpus entries
export interface CorpusEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  nodes: string[];
  axes: string[];
  state: 'draft' | 'published' | 'archived';
}

export const corpusIndex: CorpusEntry[] = [
  {
    id: 'corpus-001',
    title: 'Miedo y Control: Una Tensión Fundacional',
    slug: 'miedo-y-control',
    excerpt: 'El miedo no es una emoción accidental en los sistemas de poder; es su arquitectura invisible.',
    nodes: ['miedo', 'legitimidad', 'silencio'],
    axes: ['control'],
    state: 'published'
  },
  {
    id: 'corpus-002',
    title: 'Legitimidad y Narrativa: El Poder de Contar Historias',
    slug: 'legitimidad-narrativa',
    excerpt: 'La legitimidad no se hereda ni se conquista — se narra. Quien controla la historia controla el presente.',
    nodes: ['legitimidad', 'narrativa', 'verdad'],
    axes: ['poder'],
    state: 'published'
  },
  {
    id: 'corpus-003',
    title: 'Automatismo y Crítica: La Tensión de la Delegación',
    slug: 'automatismo-critica',
    excerpt: 'Cuando delegamos el pensamiento en sistemas automáticos, ¿delegamos también la responsabilidad?',
    nodes: ['automatismo', 'critica', 'verdad'],
    axes: ['tecnica', 'metodo'],
    state: 'published'
  },
  {
    id: 'corpus-004',
    title: 'Silencio y Resistencia: La Ambigüedad del No-Decir',
    slug: 'silencio-resistencia',
    excerpt: 'El silencio es polisémico. Puede ser resistencia o complicidad, prudencia o cobardía.',
    nodes: ['silencio', 'legitimidad'],
    axes: ['resistencia'],
    state: 'published'
  }
];

// Raw markdown content for static loading
export const corpusContent: Record<string, string> = {
  'miedo-y-control': `# Miedo y Control: Una Tensión Fundacional

## Tesis Central

El miedo no es una emoción accidental en los sistemas de poder; es su arquitectura invisible.

## El Círculo del Control

> "El miedo no necesita ser real para ser efectivo. Basta con que sea creíble."

Cuando analizamos las estructuras de control social, encontramos un patrón recurrente:

1. **Identificación de amenaza** — Real o construida
2. **Amplificación narrativa** — El peligro se vuelve omnipresente
3. **Oferta de protección** — A cambio de libertad
4. **Normalización** — El miedo se vuelve invisible

## Pregunta Socrática Derivada

*Si el miedo te protege, ¿de qué te priva?*

Esta pregunta no busca eliminar el miedo, sino hacerlo visible. El miedo invisible es el más peligroso porque opera sin auditoría.

## Conexiones con Otros Nodos

- **Legitimidad**: El miedo construye legitimidad para quien ofrece protección
- **Silencio**: El miedo produce silencio, y el silencio produce más miedo
- **Narrativa**: Quien controla la narrativa del miedo, controla el miedo mismo

## Referencia Filosófica

Hobbes entendió esto mejor que nadie: el Leviatán nace del miedo mutuo. Pero olvidó preguntarse: ¿quién administra ese miedo después?

---

*Nodo: miedo | Eje: control | Estado: activo*`,

  'legitimidad-narrativa': `# Legitimidad y Narrativa: El Poder de Contar Historias

## Tesis Central

La legitimidad no se hereda ni se conquista — se narra. Quien controla la historia controla el presente.

## La Construcción Narrativa del Poder

> "Todo poder necesita una historia que lo justifique. Sin narrativa, el poder es solo violencia."

La legitimidad opera en tres niveles:

1. **Origen mítico** — "Siempre fue así"
2. **Justificación racional** — "Es lo más eficiente"
3. **Proyección futura** — "Es inevitable"

## El Problema de la Verdad Dominante

*¿La narrativa dominante es dominante porque es verdadera, o verdadera porque es dominante?*

Esta pregunta no tiene respuesta estable. Es una tensión permanente que debe mantenerse activa.

## Mecanismos de Legitimación

### Repetición
Lo que se repite se normaliza. Lo normal se vuelve verdadero.

### Exclusión
Lo que no se narra no existe. El silencio es una forma de narrativa.

### Institucionalización
Cuando la narrativa se convierte en institución, deja de parecer narrativa.

## Conexiones con Otros Nodos

- **Miedo**: La narrativa del miedo legitima la protección
- **Verdad**: La verdad compite con la narrativa, pero rara vez gana
- **Silencio**: Lo no dicho es tan narrativo como lo dicho

## Referencia Filosófica

Foucault demostró que el poder no solo reprime — produce. Produce verdad, produce sujetos, produce realidad.

---

*Nodo: narrativa, legitimidad | Eje: poder | Estado: saturado*`,

  'automatismo-critica': `# Automatismo y Crítica: La Tensión de la Delegación

## Tesis Central

Cuando delegamos el pensamiento en sistemas automáticos, ¿delegamos también la responsabilidad?

## El Oráculo Moderno

> "La IA no piensa por nosotros. Piensa en lugar de nosotros. La diferencia es crucial."

El automatismo ofrece tres promesas:

1. **Eficiencia** — Más rápido, más preciso
2. **Objetividad** — Sin sesgos humanos
3. **Escalabilidad** — Para todos, siempre

Pero cada promesa oculta una pregunta.

## Las Preguntas Ocultas

### Sobre la eficiencia
*¿Eficiente para qué? ¿Definido por quién?*

### Sobre la objetividad
*¿Los datos son neutrales? ¿Los algoritmos son transparentes?*

### Sobre la escalabilidad
*¿Lo que funciona para todos funciona para alguien?*

## El Método Socrático como Antídoto

La crítica socrática no rechaza el automatismo — lo interroga.

*¿Puede una máquina formular la pregunta que no quieres escuchar?*

Esta es la pregunta central de PlatonIA. No si la IA puede pensar, sino si puede incomodar productivamente.

## Conexiones con Otros Nodos

- **Verdad**: El automatismo produce respuestas, no verdades
- **Tensión**: La crítica mantiene la tensión que el automatismo quiere resolver
- **Miedo**: El miedo a la complejidad alimenta el deseo de automatismo

## Referencia Filosófica

Heidegger advirtió sobre la técnica como "emplazamiento" — convertir todo en recurso disponible. El pensamiento también puede ser emplazado.

---

*Nodo: automatismo, critica | Eje: tecnica, metodo | Estado: activo*`,

  'silencio-resistencia': `# Silencio y Resistencia: La Ambigüedad del No-Decir

## Tesis Central

El silencio es polisémico. Puede ser resistencia o complicidad, prudencia o cobardía. Solo el contexto — y la honestidad — pueden distinguirlos.

## La Gramática del Silencio

> "Hay silencios que gritan y palabras que callan."

El silencio opera en múltiples registros:

1. **Silencio táctico** — Esperar el momento
2. **Silencio protector** — Preservar a otros
3. **Silencio cómplice** — Consentir por omisión
4. **Silencio impotente** — No poder hablar

## La Pregunta Incómoda

*¿Quién decide qué silencio es prudencia y cuál es cobardía?*

Esta pregunta no tiene juez externo. Es un ejercicio de autointerrogación permanente.

## Cuando Callar es Consentir

El silencio ante la injusticia tiene un costo. Pero también lo tiene el habla irreflexiva.

### El dilema
- Hablar puede ser peligroso
- Callar puede ser traición
- No hay posición neutral

### La tensión productiva
Mantener la incomodidad de la decisión. No resolverla prematuramente.

## Conexiones con Otros Nodos

- **Legitimidad**: El silencio puede legitimar o deslegitimar
- **Miedo**: El miedo produce silencio, pero el silencio también produce miedo
- **Verdad**: ¿La verdad callada sigue siendo verdad?

## Referencia Filosófica

Wittgenstein terminó el Tractatus con silencio: "De lo que no se puede hablar, hay que callar." Pero, ¿y si el silencio es precisamente el problema?

---

*Nodo: silencio | Eje: resistencia | Estado: latente*`
};
