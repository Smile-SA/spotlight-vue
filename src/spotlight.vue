<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useThrottleFn } from '@vueuse/core';

import { serverState } from '@slidev/client/env';
import { clicks, currentPage, isPresenter } from '@slidev/client/logic/nav';
import { showPresenterCursor } from '@slidev/client/state'

const props = defineProps<{
  activationKey?: string;
  color?: string;
  opacity?: number | string;
  size?: string;
  transitionDuration?: string;
}>();
const { activationKey = 'Control' } = props;

let x = 0;
let y = 0;
let slidesContainer;
let showPresenterCursorSave;
const active = ref(false);
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

function broadcastSpotlightPosition(position: {x?: number, y?: number}) {
  if (isPresenter.value) {
    const showSpotlight = !!position.x;
    if (showSpotlight) showPresenterCursor.value = false;
    serverState.$patch({
      page: currentPage.value,
      clicks: clicks.value,
      cursor: {x: -100, y: -100},
      spotlight: position
    });
    if (!showSpotlight) showPresenterCursor.value = showPresenterCursorSave;
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === activationKey) {
    if (!active.value) showPresenterCursorSave = showPresenterCursor.value;
    active.value = true;
    broadcastSpotlightPosition({x, y}); // Show spotlight on other tabs even if mouse doesn't move
    updatePosition();
  }
}

function onKeyup(event: KeyboardEvent) {
  if (event.key === activationKey) {
    active.value = false;
    broadcastSpotlightPosition({}); // Push empty data to hide spotlight in other tabs
  }
}

const onMousemove = useThrottleFn((event: MouseEvent) => {
  const rect = slidesContainer.getBoundingClientRect()
  // Compute x & y as % of the slide (useful in presentation mode because slide is not full screen)
  x = (event.x - rect.left) / rect.width * 100;
  y = (event.y - rect.top) / rect.height * 100;
  if (active.value) {
    broadcastSpotlightPosition({x, y}); // Push data for other tabs
    updatePosition();
  }
}, 1000/60);

function updatePosition() {
  if (spotlight.value) {
    spotlight.value.style.left = x + "%";
    spotlight.value.style.top = y + "%";
  }
}

onMounted(() => {
  slidesContainer = document.querySelector('#slide-content'); // FIXME: didn't find a better way to get the reference as it's from a parent component
  serverState.$onPatch(({spotlight: position}) => {
    active.value = !!position.x; // Hide spotlight when no coords
    if (active.value) {
      x = position.x;
      y = position.y;
      updatePosition();
    }
  });
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
  transition: opacity var(--transition-duration), visibility var(--transition-duration);
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
  transition: width var(--transition-duration), height var(--transition-duration);
}

.spotlight--active {
  width: var(--size);
  height: var(--size);
}
</style>

<template>
  <div class="spotlight__overlay" :class="{ 'spotlight__overlay--active': active }">
    <div
        class="spotlight"
        :class="{ 'spotlight--active': active }"
        :style="cssVars"
        ref="spotlight"
    ></div>
  </div>
</template>
