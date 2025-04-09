import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { Post } from "@/types";

const postsDirectory = path.join(process.cwd(), "content");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

// 디렉토리 없으면 생성
function ensureDirectories() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
}

export function getPostSlugs() {
  ensureDirectories();
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

// URL 디코딩 함수 - URL 인코딩된 한글 처리
function decodeSlug(slug: string): string {
  try {
    // URL 인코딩된 문자열인 경우 디코딩
    if (slug.includes("%")) {
      return decodeURIComponent(slug);
    }
    return slug;
  } catch (error) {
    console.error("디코딩 에러:", slug, error);
    return slug;
  }
}

// 타임스탬프 포함 슬러그에서 기본 이름 추출
function getBaseSlug(slug: string): string {
  // '-1234567890123' 패턴 찾기 (타임스탬프)
  const timestampMatch = slug.match(/-\d{10,}$/);
  if (timestampMatch) {
    return slug.substring(0, timestampMatch.index);
  }
  return slug;
}

// 디버깅 함수
function logAvailableFiles() {
  if (process.env.NODE_ENV === "development") {
    const files = fs.readdirSync(postsDirectory);
    console.log("사용 가능한 파일들:", files);
  }
}

// 더 자세한 로깅을 위한 함수
function logSlugDetails(
  slug: string,
  decodedSlug: string,
  foundFile: string | null
) {
  if (process.env.NODE_ENV === "development") {
    console.log("슬러그 변환 과정:");
    console.log("- 원본 슬러그:", slug);
    console.log("- 디코딩된 슬러그:", decodedSlug);
    console.log("- 발견된 파일:", foundFile || "없음");
  }
}

// 파일 이름 찾기 함수
function findFileNameBySlug(slug: string): string | null {
  // 슬러그 디코딩
  const decodedSlug = decodeSlug(slug);
  const baseSlug = getBaseSlug(decodedSlug);

  try {
    const files = fs.readdirSync(postsDirectory);

    // 디버깅용 로그
    if (process.env.NODE_ENV === "development") {
      console.log(
        `슬러그 검색: "${slug}" (디코딩: "${decodedSlug}", 기본: "${baseSlug}")`
      );
    }

    // 다양한 방식으로 일치하는 파일 검색

    // 1. 정확히 일치하는 파일 찾기
    let exactMatch = files.find((file) => file === `${decodedSlug}.md`);
    if (exactMatch) {
      logSlugDetails(slug, decodedSlug, exactMatch);
      return exactMatch;
    }

    // 2. 타임스탬프가 있는 슬러그 처리
    const timestampPattern = new RegExp(`^${baseSlug}-\\d{10,}\\.md$`);
    const timestampMatch = files.find((file) => timestampPattern.test(file));
    if (timestampMatch) {
      logSlugDetails(slug, decodedSlug, timestampMatch);
      return timestampMatch;
    }

    // 3. 기본 이름으로 시작하는 파일 찾기
    const baseNameMatch = files.find(
      (file) =>
        file.startsWith(`${baseSlug}-`) || file.startsWith(`${baseSlug}.md`)
    );
    if (baseNameMatch) {
      logSlugDetails(slug, decodedSlug, baseNameMatch);
      return baseNameMatch;
    }

    // 4. 디코딩된 슬러그가 파일 이름에 포함되는지 확인
    const containsMatch = files.find((file) => file.includes(baseSlug));
    if (containsMatch) {
      logSlugDetails(slug, decodedSlug, containsMatch);
      return containsMatch;
    }

    // 5. 모든 파일 순회하며 비교
    for (const file of files) {
      const fileNameWithoutExt = file.replace(/\.md$/, "");

      // 파일명과 디코딩된 슬러그 비교
      if (
        fileNameWithoutExt === decodedSlug ||
        fileNameWithoutExt.startsWith(decodedSlug + "-") ||
        fileNameWithoutExt.endsWith("-" + decodedSlug)
      ) {
        logSlugDetails(slug, decodedSlug, file);
        return file;
      }

      // 타임스탬프 제거 후 비교
      const fileBase = getBaseSlug(fileNameWithoutExt);
      if (fileBase === baseSlug) {
        logSlugDetails(slug, decodedSlug, file);
        return file;
      }
    }

    // 파일을 찾지 못함 - 로그 출력
    if (process.env.NODE_ENV === "development") {
      logAvailableFiles();
    }

    return null;
  } catch (error) {
    console.error("파일 찾기 중 오류:", error);
    return null;
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    ensureDirectories();

    // 디코딩 및 확장자 처리
    const fileNameWithExt = findFileNameBySlug(slug);

    if (!fileNameWithExt) {
      if (process.env.NODE_ENV === "development") {
        console.error(`파일을 찾을 수 없음: ${slug}`);
      }
      return null;
    }

    const realSlug = fileNameWithExt.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileNameWithExt);

    if (!fs.existsSync(fullPath)) {
      if (process.env.NODE_ENV === "development") {
        console.error(`파일이 존재하지 않음: ${fullPath}`);
      }
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // 이미지 경로가 절대 경로인지 확인하고 아니면 수정
    let thumbnail = data.thumbnail;
    if (thumbnail && !thumbnail.startsWith("/")) {
      thumbnail = `/${thumbnail}`;
    }

    return {
      slug: realSlug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      content,
      categories: Array.isArray(data.categories)
        ? data.categories
        : data.categories
        ? [data.categories]
        : [],
      excerpt: data.excerpt || "",
      thumbnail: thumbnail || null,
    };
  } catch (error) {
    console.error(`포스트 가져오기 오류 (${slug}):`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  ensureDirectories();

  try {
    const slugs = getPostSlugs();

    const posts = slugs
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        return getPostBySlug(slug);
      })
      .filter((post): post is Post => post !== null)
      .sort((post1, post2) =>
        new Date(post2.date) > new Date(post1.date) ? 1 : -1
      );

    return posts;
  } catch (error) {
    console.error("모든 포스트 가져오기 오류:", error);
    return [];
  }
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categoriesSet = new Set<string>();

  posts.forEach((post) => {
    if (post.categories && post.categories.length > 0) {
      post.categories.forEach((category) => {
        categoriesSet.add(category);
      });
    }
  });

  return Array.from(categoriesSet);
}

export function getPostsByCategory(category: string): Post[] {
  if (category === "all") {
    return getAllPosts();
  }

  const posts = getAllPosts();
  return posts.filter(
    (post) => post.categories && post.categories.includes(category)
  );
}

export async function savePost(post: Post): Promise<boolean> {
  try {
    ensureDirectories();

    const fullPath = path.join(postsDirectory, `${post.slug}.md`);

    // 이미지 경로 정규화
    let thumbnail = post.thumbnail;
    if (thumbnail && thumbnail.startsWith("/")) {
      thumbnail = thumbnail.substring(1); // 앞의 '/' 제거
    }

    const frontmatter: any = {
      title: post.title,
      date: post.date,
      categories: post.categories || [],
      excerpt: post.excerpt || "",
    };

    if (thumbnail) {
      frontmatter.thumbnail = thumbnail;
    }

    const fileContent = matter.stringify(post.content, frontmatter);

    fs.writeFileSync(fullPath, fileContent);
    return true;
  } catch (error) {
    console.error("포스트 저장 오류:", error);
    return false;
  }
}

// 글 삭제 함수
export async function deletePost(slug: string): Promise<boolean> {
  try {
    ensureDirectories();

    // 디코딩 및 파일명 찾기
    const fileNameWithExt = findFileNameBySlug(slug);

    if (!fileNameWithExt) {
      return false;
    }

    const fullPath = path.join(postsDirectory, fileNameWithExt);

    // 파일이 존재하는지 확인
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    // 파일 삭제
    fs.unlinkSync(fullPath);
    return true;
  } catch (error) {
    console.error("포스트 삭제 오류:", error);
    return false;
  }
}

export async function saveImage(file: File): Promise<string | null> {
  try {
    ensureDirectories();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 이름에 타임스탬프 추가하여 고유성 보장
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    const imagePath = path.join(uploadsDirectory, fileName);

    fs.writeFileSync(imagePath, buffer);

    // 웹에서 접근 가능한 경로 반환
    return `uploads/${fileName}`; // 앞의 '/' 제거하여 저장
  } catch (error) {
    console.error("이미지 저장 오류:", error);
    return null;
  }
}

export async function markdownToHtml(markdown: string) {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error("마크다운 변환 오류:", error);
    return "<p>Error rendering content</p>";
  }
}
