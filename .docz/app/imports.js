export const imports = {
  'ISSUE_TEMPLATE.md': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "issue-template" */ 'ISSUE_TEMPLATE.md'
    ),
  'PULL_REQUEST_TEMPLATE.md': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "pull-request-template" */ 'PULL_REQUEST_TEMPLATE.md'
    ),
  'docs/index.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "docs-index" */ 'docs/index.mdx'
    ),
  'docs/view.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "docs-view" */ 'docs/view.mdx'
    ),
}
