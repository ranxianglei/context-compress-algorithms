import { defineConfig } from "tsup"

export default defineConfig({
    entry: {
        index: "src/index.ts",
        "quality-gate/index": "src/quality-gate/index.ts",
        "prompts/index": "src/prompts/index.ts",
        "trigger/index": "src/trigger/index.ts",
    },
    format: ["esm"],
    target: "es2022",
    dts: false,
    sourcemap: true,
    clean: false,
    treeshake: true,
})
