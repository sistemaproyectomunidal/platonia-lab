/**
 * API Services Index
 * Central export point for all API services
 */

export * from './base';
export * from './lab.service';
export * from './corpus.service';
export * from './map.service';
export * from './podcast.service';
export * from './socratic.service';
export * from './file.service';

// Re-export service instances for convenience
export { labService } from './lab.service';
export { corpusService } from './corpus.service';
export { mapService } from './map.service';
export { podcastService } from './podcast.service';
export { socraticService } from './socratic.service';
export { fileService } from './file.service';
