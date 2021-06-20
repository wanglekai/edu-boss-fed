<template>
  <div class="menu-create">
    <create-or-edit :isEdit="true" />
  </div>
</template>
<script>
import CreateOrEdit from './components/CreateOrEdit'

export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
}
</script>
