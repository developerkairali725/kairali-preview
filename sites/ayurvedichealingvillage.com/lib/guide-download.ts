import manifest from '../public/documents/manifest.json' with { type: 'json' };

type ManifestFile = {
  doc?: string;
  lang?: string;
  status?: string;
  screen?: { path?: string };
};

const FALLBACK_LANGUAGE = 'en';
const healingSecrets = new Map(
  (manifest.files as ManifestFile[])
    .filter((file) => file.doc === 'healing-secrets' && file.status === 'final' && file.lang && file.screen?.path)
    .map((file) => [file.lang!.toLowerCase(), `/documents/${file.screen!.path}`]),
);

export function guideDownloadUrl(language: unknown): string {
  const normalized = typeof language === 'string'
    ? language.trim().toLowerCase().split(/[-_]/)[0]
    : FALLBACK_LANGUAGE;
  return healingSecrets.get(normalized) ?? healingSecrets.get(FALLBACK_LANGUAGE) ?? '';
}

export function guideLanguageCount(): number {
  return healingSecrets.size;
}
