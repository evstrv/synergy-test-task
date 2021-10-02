<template>
  <div class="wrapper">
    <dialog class="big-picture" :open="show">
      <img :src="picturePath.large" @click="showBigPicture"/>
    </dialog>
    <div class="user-card">
      <img :src="picturePath.large" @click="showBigPicture" />
      <div class="user-card__user-info">
        <span>
          {{ userName.title }} {{ userName.first }} {{ userName.last }}
        </span>
        <span>{{ user.phone }}</span>
        <span>{{ user.email }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: [],
      userName: [],
      picturePath: [],
      show: false,
    }
  },

  mounted() {
    this.user = this.$route.params.user
    this.userName = this.user.name
    this.picturePath = this.user.picture
  },

  methods: {
    showBigPicture() {
      this.show = !this.show
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: calc(100vh - 16px);
  display: flex;
  align-items: center;

  .big-picture {
    padding: 0;
    border: none;

    > img {
      width: calc(100vw - 16px);
    }
  }
  
  .user-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    max-width: 300px;

    > img {
      width: 128px;
      border-radius: 50%;
    }

    > div {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      > span {
        padding: 10px 0;
      }
    }
  }
}
</style>
