<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/Auctiontry'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail }
}
</script>
