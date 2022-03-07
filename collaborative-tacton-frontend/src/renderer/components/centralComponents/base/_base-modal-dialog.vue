<template>
  <div>
    <transition name="modal">
      <div v-if="visible">
        <div class="overlay" @click.self="$emit('close')">
          <div class="modal">
            <slot class="content" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "BaseModalDialog",
  props: {
    visible: { type: Boolean, default: false },
  },
  emits: ["close"],
};
</script>

<style scoped>
.modal {
  width: 600px;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  color: black;
  overflow-y: auto;
  max-height: 95%;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}
</style>
