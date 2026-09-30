# Reproduce the staging assets

Source code, datasets and runtime text are versioned in this branch. The original media/font binaries are stored in the private company GitHub staging release, pinned by archive and individual SHA-256 in runtime-assets-release.json.

After cloning and signing into the company repository with GitHub CLI, run from this site directory:

```sh
pnpm assets:restore
pnpm build
```

The restore command verifies every existing file, refuses to overwrite modified assets, verifies the downloaded archive before extraction and checks each unpacked file. No credentials or private source-provenance records are included. Vercel Preview is deployed deliberately through the existing AHV project using the locally assembled assets; this does not connect automatic production deployment.
