const INVALID_FILE_NAME_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;
const UUID_LIKE_BASE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_BASE_NAME = "face-icon";
const MAX_BASE_NAME_LENGTH = 32;

export function buildDownloadFileName(originalName: string, date = new Date()): string {
  const baseName = originalName.replace(/\.[^/.]+$/, "") || FALLBACK_BASE_NAME;
  const safeBaseName = toSafeBaseName(baseName);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${safeBaseName}_face${year}${month}${day}.png`;
}

function toSafeBaseName(baseName: string): string {
  const sanitizedBaseName = baseName.replace(INVALID_FILE_NAME_CHARS, "_").trim();

  if (!sanitizedBaseName || UUID_LIKE_BASE_NAME.test(sanitizedBaseName)) {
    return FALLBACK_BASE_NAME;
  }

  return (
    sanitizedBaseName
      .slice(0, MAX_BASE_NAME_LENGTH)
      .replace(/[\s._-]+$/, "")
      .trim() || FALLBACK_BASE_NAME
  );
}
