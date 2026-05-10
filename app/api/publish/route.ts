import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: Request) {
  try {
    const { file, content } = await request.json();

    if (!file || !content) {
      return NextResponse.json(
        { ok: false, error: "缺少 file 或 content" },
        { status: 400 }
      );
    }

    if (!file.startsWith("posts/")) {
      return NextResponse.json(
        { ok: false, error: "文件路径必须以 posts/ 开头" },
        { status: 400 }
      );
    }

    const { data } = matter(content);
    const slug = data.slug || path.basename(file, ".md");
    const outPath = path.join(process.cwd(), "content", file);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content, "utf-8");

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
