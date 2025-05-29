/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as challenges from "../challenges.js";
import type * as http from "../http.js";
import type * as memoryGame from "../memoryGame.js";
import type * as memoryGameData from "../memoryGameData.js";
import type * as profiles from "../profiles.js";
import type * as responseTrainer from "../responseTrainer.js";
import type * as responseTrainerData from "../responseTrainerData.js";
import type * as router from "../router.js";
import type * as seedData from "../seedData.js";
import type * as tracks from "../tracks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  challenges: typeof challenges;
  http: typeof http;
  memoryGame: typeof memoryGame;
  memoryGameData: typeof memoryGameData;
  profiles: typeof profiles;
  responseTrainer: typeof responseTrainer;
  responseTrainerData: typeof responseTrainerData;
  router: typeof router;
  seedData: typeof seedData;
  tracks: typeof tracks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
