import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getDirectoryTree(dirPath: string, depth = 0, maxDepth = 4): any {
  if (depth > maxDepth) return null;
  const basename = path.basename(dirPath);

  if (["node_modules", ".next", ".git", "out", "build"].includes(basename)) {
    return null;
  }

  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      const items = fs.readdirSync(dirPath);
      const children = items
        .map((item) => getDirectoryTree(path.join(dirPath, item), depth + 1, maxDepth))
        .filter(Boolean);

      return {
        name: basename,
        type: "directory",
        path: dirPath.replace(/\\/g, "/"),
        children,
      };
    } else {
      return {
        name: basename,
        type: "file",
        sizeBytes: stats.size,
        extension: path.extname(basename),
        path: dirPath.replace(/\\/g, "/"),
      };
    }
  } catch {
    return null;
  }
}

export async function GET() {
  const rootDir = process.cwd();
  const tree = getDirectoryTree(rootDir, 0, 4);

  return NextResponse.json({
    success: true,
    projectRoot: rootDir,
    structure: tree,
    timestamp: new Date().toISOString(),
  });
}
