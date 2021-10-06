<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/Requsetatoken'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail }
}
</script>

