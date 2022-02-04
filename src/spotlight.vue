<script setup lang="ts">
import { computed, defineEmits, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useThrottleFn } from "@vueuse/core";

export interface Position {
  x: number,
  y: number
}

const props = defineProps<{
  active?: boolean;
  activationKey?: string;
  color?: string;
  opacity?: number | string;
  size?: string;
  transitionDuration?: string;
  x?: number;
  y?: number;
}>();
const { activationKey = "Control" } = props;

const emit = defineEmits(['activate', 'deactivate', 'update']);

let x = 0;
let y = 0;
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

watchEffect(() => updatePosition(props.x, props.y));
watchEffect(() => updateActive(props.active));

function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value));
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === activationKey) {
    updateActive(true);
    const position: Position = { x, y };
    emit('activate', position);
    updatePosition(x, y);
  }
}

function onKeyup(event: KeyboardEvent) {
  if (event.key === activationKey) {
    updateActive(false);
    const position: Position = { x, y };
    emit('deactivate', position);
  }
}

const onMousemove = useThrottleFn((event: MouseEvent) => {
  if (overlay.value && spotlight.value) {
    const { height, left, top, width } = overlay.value.getBoundingClientRect();
    x = ((event.clientX - left) / width) * 100;
    y = ((event.clientY - top) / height) * 100;
  }
  if (active.value) {
    const position: Position = { x, y };
    emit('update', position);
    updatePosition(x, y);
  }
}, 1000 / 60);

function updateActive(isActive?: boolean) {
  active.value = Boolean(isActive);
}

function updatePosition(x?: number, y?: number) {
  if (spotlight.value && x !== undefined && y !== undefined) {
    spotlight.value.style.left = x + "%";
    spotlight.value.style.top = y + "%";
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
.spotlight__overlay {
  --color: black;
  --opacity: 0.75;
  --size: 100px;
  --transition-duration: 200ms;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  background-color: var(--color);
  mix-blend-mode: multiply;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-duration),
    visibility var(--transition-duration);
}

.spotlight__overlay--active {
  opacity: var(--opacity);
  visibility: visible;
}

.spotlight {
  position: absolute;
  box-sizing: content-box;
  cursor: none;
  pointer-events: all;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 0;
  height: 0;
  transition: width var(--transition-duration),
    height var(--transition-duration);
}

.spotlight--active {
  width: var(--size);
  height: var(--size);
}
</style>

<template>
  <div
    class="spotlight__overlay"
    :class="{ 'spotlight__overlay--active': active }"
    ref="overlay"
  >
    <div
      class="spotlight"
      :class="{ 'spotlight--active': active }"
      :style="cssVars"
      ref="spotlight"
    ></div>
  </div>
</template>
