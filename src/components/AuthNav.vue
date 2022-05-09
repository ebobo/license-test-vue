<template>
  <div class="navbar-nav ml-auto">
    <authentication-button />
  </div>
</template>

<script>
import AuthenticationButton from '@/components/AuthenticationButton';

export default {
  name: 'AuthNav',
  components: { AuthenticationButton },
};
</script>
