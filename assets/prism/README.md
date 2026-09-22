# Prism syntax highlighting

Vendored PrismJS **1.30.0**, MIT licensed. Fully local: no CDN or autoloader.

Source: https://www.npmjs.com/package/prismjs/v/1.30.0
Documentation: https://prismjs.com/#basic-usage

Bundle order: core, clike, javascript, typescript, bash, yaml (unmodified minified components).
Verified npm tarball integrity: `sha512-DEvV2ZF2r2/63V+tK8hQvrR2ZGn10srHbXviTlcv7Kpzw8jWiNTqbVgjO3IY8RxrrOUF8VPMQQFysYYYv0YZxw==`

Use code.language-typescript, code.language-bash or code.language-yaml inside pre; use language-none for diagrams. Include the bundle with a relative deferred script. Escape HTML in code as before. Without JavaScript, the original readable code remains.

For updates, verify a pinned package, concatenate those components in order and preserve LICENSE. Colors and print overrides live in ../course.css. Recheck tokenization, unchanged code text and offline browser rendering after updates.
