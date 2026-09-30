// Windows bsdtar writes CRLF; member identities remain exact and fail closed.
export function assertArchiveMembers(listing, files) {
  const names = listing.replace(/\r?\n$/, "").split(/\r?\n/);
  const allowed = new Set(files.map(f => f.file));
  if (names.length !== allowed.size || new Set(names).size !== names.length || names.some(n => !allowed.has(n))) {
    throw Error('Unexpected archive member');
  }
}

