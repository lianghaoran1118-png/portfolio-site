<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Icon from './Icon.vue'
import ImagePlaceholder from './ImagePlaceholder.vue'
import CodeBlock from './CodeBlock.vue'

const props = defineProps({
  project: { type: Object, required: true },
})

// 多张截图切换：project.images = [{ src, label }]
const images = computed(() =>
  Array.isArray(props.project.images) && props.project.images.length > 0
    ? props.project.images
    : props.project.imageSrc
      ? [{ src: props.project.imageSrc, label: props.project.imageLabel || '截图' }]
      : null
)
const isCarousel = computed(() => (images.value ? images.value.length > 1 : false))
const current = ref(0)

// 多段代码切换：project.codes = [{ label, title, lang, code }]
const codeTabs = computed(() =>
  Array.isArray(props.project.codes) && props.project.codes.length > 0
    ? props.project.codes
    : null
)
const hasCodeTabs = computed(() => (codeTabs.value ? codeTabs.value.length > 1 : false))
const activeCodeIdx = ref(0)
function pickCode(i) {
  activeCodeIdx.value = i
}

// 手动切换（不自动播放）
function goto(idx) {
  if (!images.value) return
  current.value = (idx + images.value.length) % images.value.length
}
function prev() {
  goto(current.value - 1)
}
function next() {
  goto(current.value + 1)
}

// ===== Lightbox 放大查看 =====
const lightbox = ref(false)
function openLightbox() {
  if (!images.value) return
  lightbox.value = true
  document.body.style.overflow = 'hidden'
}
function closeLightbox() {
  lightbox.value = false
  document.body.style.overflow = ''
}
// 在 lightbox 内左右切换（不关闭）
function lbPrev() {
  prev()
}
function lbNext() {
  next()
}
function onKey(e) {
  if (!lightbox.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') lbPrev()
  if (e.key === 'ArrowRight') lbNext()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <article
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
  >
    <!-- 标签 -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {{ project.tag }}
      </span>
      <span
        v-if="project.status"
        class="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
      >
        {{ project.status }}
      </span>
    </div>

    <h3 class="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
      {{ project.title }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
      {{ project.desc }}
    </p>

    <!-- 技术栈 -->
    <div class="mt-5 flex flex-wrap gap-2">
      <span
        v-for="t in project.tech"
        :key="t"
        class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
      >
        {{ t }}
      </span>
    </div>

    <!-- 截图：多图手动切换 或 单图 -->
    <div class="mt-6">
      <template v-if="images">
        <!-- 大图展示（点击放大） -->
        <div
          class="relative overflow-hidden rounded-xl border border-slate-200 bg-white"
          :class="{ 'cursor-zoom-in': images[current].src }"
          @click="openLightbox"
          :title="images[current].src ? '点击放大查看原图' : ''"
        >
          <ImagePlaceholder
            :key="current"
            :label="images[current].label"
            :src="images[current].src"
          />
          <!-- 手动左右切换（在缩略图上也可操作） -->
          <template v-if="isCarousel">
            <button
              @click.stop="prev"
              class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow transition hover:bg-white"
              aria-label="上一张"
            >
              <Icon name="chevron-left" :size="18" />
            </button>
            <button
              @click.stop="next"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow transition hover:bg-white"
              aria-label="下一张"
            >
              <Icon name="chevron-right" :size="18" />
            </button>
            <!-- 圆点指示器 -->
            <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              <button
                v-for="(img, i) in images"
                :key="i"
                @click.stop="goto(i)"
                :class="[
                  'h-2 w-2 rounded-full transition',
                  current === i ? 'bg-blue-600' : 'bg-white/70 hover:bg-white',
                ]"
                :aria-label="`查看第 ${i + 1} 张`"
              ></button>
            </div>
            <!-- 放大提示角标 -->
            <span class="absolute right-3 top-3 rounded bg-black/50 px-2 py-1 text-[10px] text-white">
              点击放大
            </span>
          </template>
        </div>

        <!-- 缩略图横排（点击手动切换） -->
        <div v-if="isCarousel" class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="(img, i) in images"
            :key="i"
            @click="goto(i)"
            :class="[
              'shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition',
              current === i
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
            ]"
          >
            {{ img.label }}
          </button>
        </div>
      </template>
      <!-- 无图片配置时显示占位 -->
      <ImagePlaceholder v-else :label="project.imageLabel" :src="project.imageSrc" />
    </div>

    <!-- 关键成果 -->
    <div class="mt-6 rounded-xl bg-slate-50 p-5">
      <h4 class="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon name="target" :size="18" class="text-blue-600" />
        关键成果
      </h4>
      <ul class="mt-3 space-y-2.5">
        <li
          v-for="(r, i) in project.results"
          :key="i"
          class="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
        >
          <Icon name="check" :size="16" class="mt-0.5 shrink-0 text-emerald-500" />
          {{ r }}
        </li>
      </ul>
    </div>

    <!-- 代码 / 提示词片段：多段代码支持标签切换 -->
    <div class="mt-6">
      <!-- 代码标签切换 -->
      <div
        v-if="hasCodeTabs"
        class="mb-3 flex gap-2 overflow-x-auto border-b border-slate-200 pb-2"
      >
        <button
          v-for="(c, i) in codeTabs"
          :key="i"
          @click="pickCode(i)"
          :class="[
            'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition',
            activeCodeIdx === i
              ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          ]"
        >
          {{ c.label }}
        </button>
      </div>

      <CodeBlock
        :title="(hasCodeTabs ? codeTabs[activeCodeIdx].title : project.codeTitle)"
        :lang="(hasCodeTabs ? codeTabs[activeCodeIdx].lang : project.codeLang)"
        :code="(hasCodeTabs ? codeTabs[activeCodeIdx].code : project.code)"
      />
    </div>

    <!-- ===== Lightbox 放大层 ===== -->
    <Teleport to="body">
      <div
        v-if="lightbox && images"
        class="fixed inset-0 z-[100] flex flex-col bg-black/90"
        @click.self="closeLightbox"
        role="dialog"
        aria-modal="true"
      >
        <!-- 顶部工具条 -->
        <div class="flex items-center justify-between px-4 py-3 text-white">
          <span class="text-sm">
            {{ images[current].label }}
            <span v-if="isCarousel" class="ml-2 text-xs text-white/60">
              {{ current + 1 }} / {{ images.length }}
            </span>
          </span>
          <button
            @click="closeLightbox"
            class="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            aria-label="关闭"
          >
            <Icon name="x" :size="20" />
          </button>
        </div>

        <!-- 大图主体 -->
        <div class="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
          <!-- 左切换 -->
          <button
            v-if="isCarousel"
            @click="lbPrev"
            class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
            aria-label="上一张"
          >
            <Icon name="chevron-left" :size="28" />
          </button>

          <img
            :src="images[current].src"
            :alt="images[current].label"
            class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />

          <!-- 右切换 -->
          <button
            v-if="isCarousel"
            @click="lbNext"
            class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
            aria-label="下一张"
          >
            <Icon name="chevron-right" :size="28" />
          </button>
        </div>

        <!-- 底部缩略图 -->
        <div v-if="isCarousel" class="flex justify-center gap-2 overflow-x-auto px-4 pb-4">
          <button
            v-for="(img, i) in images"
            :key="i"
            @click="goto(i)"
            :class="[
              'h-12 w-20 shrink-0 overflow-hidden rounded border transition',
              current === i
                ? 'border-blue-400'
                : 'border-transparent opacity-60 hover:opacity-100',
            ]"
          >
            <img :src="img.src" :alt="img.label" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>
    </Teleport>
  </article>
</template>