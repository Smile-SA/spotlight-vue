<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    activationKey?: string;
    color?: string;
    opacity?: number | string;
    size?: string;
    transitionDuration?: string;
  }>(),
  { activationKey: "Alt" }
);

let x = 0;
let y = 0;
let cursor = document.body.style.cursor;
const active = ref(false);
const overlay = ref<HTMLDivElement>();
const spotlight = ref<HTMLDivElement>();

const cssVars = computed(() =>
  removeEmptyValues({
    "--color": props.color,
    "--opacity": props.opacity,
    "--size": props.size,
    "--transition-duration": props.transitionDuration,
  })
);

function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value));
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === props.activationKey) {
    active.value = true;
    document.body.style.cursor = "none";
  }
}

function onKeyup(event: KeyboardEvent) {
  if (event.key === props.activationKey) {
    active.value = false;
  }
}

function onMousemove(event: MouseEvent) {
  x = event.clientX;
  y = event.clientY;
  updatePosition();
}

function updatePosition() {
  if (overlay.value && spotlight.value) {
    const { height, left, top, width } = overlay.value.getBoundingClientRect();
    spotlight.value.style.left = ((x - left) / width) * 100 + "%";
    spotlight.value.style.top = ((y - top) / height) * 100 + "%";
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyup);
  window.addEventListener("mousemove", onMousemove);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("keyup", onKeyup);
  window.removeEventListener("mousemove", onMousemove);
});
</script>

<style scoped>
.spotlight-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.spotlight {
  --color: black;
  --opacity: 0.75;
  --size: 100px;
  --transition-duration: 200ms;

  position: absolute;
  box-sizing: content-box;
  cursor: none;
  pointer-events: all;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 9999px solid var(--color);
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
  transition: width var(--transition-duration),
    height var(--transition-duration), opacity var(--transition-duration), visibility var(--transition-duration);
}

.spotlight-active {
  width: var(--size);
  height: var(--size);
  opacity: var(--opacity);
  visibility: visible;
}
</style>

<template>
  <div class="spotlight-overlay" ref="overlay">
    <div
      class="spotlight"
      :class="{ 'spotlight-active': active }"
      :style="cssVars"
      ref="spotlight"
    ></div>
  </div>
</template>