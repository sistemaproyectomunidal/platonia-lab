/**
 * Example: Direct Service Usage (without React hooks)
 * Useful for: server-side code, utilities, scripts, non-React contexts
 */

import {
  labService,
  corpusService,
  mapService,
  podcastService,
  socraticService,
  fileService,
} from "@/services/api";

/**
 * Example: Lab Demo Operations
 */
export async function labServiceExample() {
  console.log("=== Lab Service Examples ===\n");

  // 1. Save a demo
  const saveResponse = await labService.saveDemoResult({
    prompt: "¿Qué es el miedo existencial?",
    summary: "Análisis sobre el miedo como concepto fundamental",
    axes: ["L1_miedo", "L4_salud_mental"],
    matchedNodes: ["miedo_existencial", "angustia"],
    questions: [
      { text: "¿El miedo es inherente a la existencia?", axis: "L1_miedo" },
    ],
    aiResponse: "El miedo existencial es...",
  });

  if (saveResponse.error) {
    console.error("Error saving demo:", saveResponse.error);
  } else {
    console.log("Demo saved with ID:", saveResponse.data?.id);
  }

  // 2. Fetch demos
  const demosResponse = await labService.fetchDemos({
    limit: 5,
    offset: 0,
    orderBy: "created_at",
    ascending: false,
  });

  if (demosResponse.data) {
    console.log(`Found ${demosResponse.data.length} demos`);
    demosResponse.data.forEach((demo, i) => {
      console.log(`  ${i + 1}. ${demo.prompt.substring(0, 50)}...`);
    });
  }

  // 3. Generate AI response
  const aiResponse = await labService.generateAIResponse({
    prompt: "¿Qué relación existe entre el miedo y el control?",
    context: "Análisis del sistema Lagrange",
    systemPrompt: "Eres un filósofo experto en análisis conceptual.",
  });

  if (aiResponse.data?.text) {
    console.log(
      "\nAI Response:",
      aiResponse.data.text.substring(0, 100) + "..."
    );
  }

  console.log("\n");
}

/**
 * Example: Map Operations
 */
export async function mapServiceExample() {
  console.log("=== Map Service Examples ===\n");

  // 1. Fetch all nodes
  const nodesResponse = await mapService.fetchNodes();

  if (nodesResponse.data) {
    console.log(`Total nodes: ${nodesResponse.data.length}`);

    // Group by axis
    const byAxis = nodesResponse.data.reduce((acc, node) => {
      acc[node.axis] = (acc[node.axis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("Nodes by axis:", byAxis);
  }

  // 2. Get nodes by specific axis
  const l1Nodes = await mapService.getNodesByAxis("L1_miedo");
  if (l1Nodes.data) {
    console.log(`\nL1_miedo nodes: ${l1Nodes.data.length}`);
    l1Nodes.data.slice(0, 3).forEach((node) => {
      console.log(`  - ${node.label}: ${node.description}`);
    });
  }

  // 3. Create a new node
  const newNode = await mapService.createNode({
    id: `test_node_${Date.now()}`,
    label: "Nodo de Prueba",
    axis: "L1_miedo",
    description: "Este es un nodo de prueba creado programáticamente",
    position_x: 250,
    position_y: 300,
  });

  if (newNode.data) {
    console.log(`\nCreated node: ${newNode.data.label} (${newNode.data.id})`);
  }

  console.log("\n");
}

/**
 * Example: Corpus Operations
 */
export async function corpusServiceExample() {
  console.log("=== Corpus Service Examples ===\n");

  // 1. Fetch published entries
  const entries = await corpusService.fetchEntries({
    status: "published",
    limit: 5,
  });

  if (entries.data) {
    console.log(`Published entries: ${entries.data.length}`);
    entries.data.forEach((entry, i) => {
      console.log(`  ${i + 1}. ${entry.title} (${entry.slug})`);
      if (entry.excerpt) {
        console.log(`     ${entry.excerpt.substring(0, 60)}...`);
      }
    });
  }

  // 2. Search entries
  const searchResults = await corpusService.searchEntries("miedo");
  if (searchResults.data) {
    console.log(`\nSearch results for "miedo": ${searchResults.data.length}`);
  }

  console.log("\n");
}

/**
 * Example: Podcast Operations
 */
export async function podcastServiceExample() {
  console.log("=== Podcast Service Examples ===\n");

  // 1. Fetch episodes
  const episodes = await podcastService.fetchEpisodes();

  if (episodes.data) {
    console.log(`Total episodes: ${episodes.data.length}`);
    episodes.data.slice(0, 3).forEach((ep) => {
      console.log(`  Ep ${ep.episode_number}: ${ep.title}`);
      console.log(`     Duration: ${ep.duration} seconds`);
    });
  }

  // 2. Get specific episode
  if (episodes.data && episodes.data.length > 0) {
    const firstEpisode = await podcastService.getEpisodeByNumber(1);
    if (firstEpisode.data) {
      console.log(`\nFirst episode: ${firstEpisode.data.title}`);
      console.log(`Published: ${firstEpisode.data.published_at}`);
    }
  }

  console.log("\n");
}

/**
 * Example: Socratic Questions Operations
 */
export async function socraticServiceExample() {
  console.log("=== Socratic Service Examples ===\n");

  // 1. Fetch all questions
  const questions = await socraticService.fetchQuestions({ limit: 10 });

  if (questions.data) {
    console.log(`Total questions: ${questions.data.length}`);
  }

  // 2. Get random questions
  const randomQuestions = await socraticService.getRandomQuestions(
    3,
    "L1_miedo"
  );

  if (randomQuestions.data) {
    console.log("\nRandom L1_miedo questions:");
    randomQuestions.data.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.text}`);
    });
  }

  // 3. Get questions by axis
  const l2Questions = await socraticService.getQuestionsByAxis("L2_control");
  if (l2Questions.data) {
    console.log(`\nL2_control questions: ${l2Questions.data.length}`);
  }

  console.log("\n");
}

/**
 * Example: File Operations
 */
export async function fileServiceExample() {
  console.log("=== File Service Examples ===\n");

  // 1. List recent uploads
  const uploads = await fileService.listFileUploads({ limit: 10 });

  if (uploads.data) {
    console.log(`Recent uploads: ${uploads.data.length}`);
    uploads.data.slice(0, 3).forEach((upload) => {
      console.log(
        `  - ${upload.filename} (${(upload.size_bytes / 1024).toFixed(2)} KB)`
      );
      console.log(`    Type: ${upload.mime_type}`);
      console.log(`    Provider: ${upload.storage_provider}`);
    });
  }

  console.log("\n");
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  Service API Examples - Direct Usage  ║");
  console.log("╚════════════════════════════════════════╝\n");

  await labServiceExample();
  await mapServiceExample();
  await corpusServiceExample();
  await podcastServiceExample();
  await socraticServiceExample();
  await fileServiceExample();

  console.log("✅ All examples completed!\n");
}

// Uncomment to run examples:
// runAllExamples().catch(console.error);
