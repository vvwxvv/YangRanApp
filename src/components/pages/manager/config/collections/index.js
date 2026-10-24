/**
 * ===========================================================================
 * WHAT   Barrel for every manager collection config.
 * USED   Pages import their config file directly; this index is the quick map:
 *        import { artworkManagerConfig } from ".../config/collections".
 * LOGIC  One export per collection - see README.md in this folder.
 * EDIT   Add an export when a collection config is added.
 * ===========================================================================
 */
/**
 * Collection configs for the shared editorial manager list.
 *
 * Add a collection by dropping a config here and rendering
 * `<EditorialManagerList config={...} />` from its manager page.
 */
export { bibliographyManagerConfig } from "./bibliographyManagerConfig";
export { artworkManagerConfig } from "./artworkManagerConfig";
export { aboutManagerConfig } from "./aboutManagerConfig";
export { artistContactManagerConfig } from "./artistContactManagerConfig";
export { enquireManagerConfig } from "./enquireManagerConfig";
export { exhibitionManagerConfig } from "./exhibitionManagerConfig";
export { imageManagerConfig } from "./imageManagerConfig";
export { videoManagerConfig } from "./videoManagerConfig";
export { eventManagerConfig } from "./eventManagerConfig";
export { resumeManagerConfig } from "./resumeManagerConfig";
export { seriesManagerConfig } from "./seriesManagerConfig";
export { webManagerConfig } from "./webManagerConfig";
export { writingManagerConfig } from "./writingManagerConfig";
